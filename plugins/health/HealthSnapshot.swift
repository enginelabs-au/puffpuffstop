import Foundation
import HealthKit

enum HealthSnapshot {
  static let fileName = "puffpuffstop-health.json"
  static let snapshotFileName = "puffpuffstop-snapshot.json"
  static let windowSeconds: TimeInterval = 20 * 60

  static func fileURL() -> URL {
    FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
      .appendingPathComponent(fileName)
  }

  static func writePayload(_ payload: [String: Any]) {
    guard let data = try? JSONSerialization.data(withJSONObject: payload, options: [.sortedKeys]) else {
      return
    }
    try? data.write(to: fileURL(), options: .atomic)
  }

  static func requestAndWrite() {
    guard HKHealthStore.isHealthDataAvailable() else {
      writePayload([
        "status": "unavailable",
        "source": "healthkit",
        "syncedAt": ISO8601DateFormatter().string(from: Date()),
      ])
      return
    }

    let store = HKHealthStore()
    let types = readTypes()
    store.requestAuthorization(toShare: [], read: types) { success, _ in
      if !success {
        writePayload([
          "status": "denied",
          "source": "healthkit",
          "syncedAt": ISO8601DateFormatter().string(from: Date()),
        ])
        return
      }
      readAroundLastPuff(store: store)
    }
  }

  private static func readTypes() -> Set<HKObjectType> {
    var types: Set<HKObjectType> = []
    let quantities: [HKQuantityTypeIdentifier] = [
      .heartRate,
      .heartRateVariabilitySDNN,
      .respiratoryRate,
      .oxygenSaturation,
    ]
    for identifier in quantities {
      if let type = HKObjectType.quantityType(forIdentifier: identifier) {
        types.insert(type)
      }
    }
    return types
  }

  private static func lastPuffDate() -> Date? {
    let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
      .appendingPathComponent(snapshotFileName)
    guard let data = try? Data(contentsOf: url),
          let root = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let daily = root["dailyLog"] as? [String: Any],
          let puffAt = daily["puffAt"] as? [Any],
          let last = puffAt.last
    else {
      return nil
    }
    if let number = last as? NSNumber {
      return Date(timeIntervalSince1970: number.doubleValue / 1000)
    }
    return nil
  }

  private static func lastSample(
    store: HKHealthStore,
    id: HKQuantityTypeIdentifier,
    unit: HKUnit,
    start: Date,
    end: Date,
    group: DispatchGroup,
    done: @escaping (Double?) -> Void
  ) {
    guard let type = HKQuantityType.quantityType(forIdentifier: id) else {
      done(nil)
      return
    }
    group.enter()
    let sort = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
    let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictStartDate)
    let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: 1, sortDescriptors: [sort]) { _, samples, _ in
      if let sample = samples?.first as? HKQuantitySample {
        done(sample.quantity.doubleValue(for: unit))
      } else {
        done(nil)
      }
      group.leave()
    }
    store.execute(query)
  }

  private static func readAroundLastPuff(store: HKHealthStore) {
    let now = Date()
    let group = DispatchGroup()
    var payload: [String: Any] = [
      "status": "ok",
      "source": "healthkit",
      "syncedAt": ISO8601DateFormatter().string(from: now),
      "dateKey": todayKey(),
    ]
    var windows: [String: (before: Double?, after: Double?, scale: Double)] = [:]
    let lock = DispatchQueue(label: "au.com.enginelabs.puffpuffstop.health")
    let puff = lastPuffDate()
    let bpm = HKUnit.count().unitDivided(by: .minute())

    func latestAndEffect(
      id: HKQuantityTypeIdentifier,
      unit: HKUnit,
      key: String,
      scale: Double = 1
    ) {
      windows[key] = (nil, nil, scale)
      lastSample(store: store, id: id, unit: unit, start: now.addingTimeInterval(-24 * 60 * 60), end: now, group: group) { value in
        if let value {
          payload[key] = value * scale
        }
      }
      guard let puff else { return }
      let beforeStart = puff.addingTimeInterval(-windowSeconds)
      lastSample(store: store, id: id, unit: unit, start: beforeStart, end: puff, group: group) { value in
        lock.sync {
          let current = windows[key] ?? (nil, nil, scale)
          windows[key] = (value, current.after, scale)
        }
      }
      lastSample(store: store, id: id, unit: unit, start: puff, end: min(now, puff.addingTimeInterval(windowSeconds)), group: group) { value in
        lock.sync {
          let current = windows[key] ?? (nil, nil, scale)
          windows[key] = (current.before, value, scale)
        }
      }
    }

    latestAndEffect(id: .heartRate, unit: bpm, key: "heartRateBpm")
    latestAndEffect(id: .heartRateVariabilitySDNN, unit: .secondUnit(with: .milli), key: "hrvMs")
    latestAndEffect(id: .respiratoryRate, unit: bpm, key: "respiratoryRate")
    latestAndEffect(id: .oxygenSaturation, unit: .percent(), key: "spo2Percent", scale: 100)

    group.notify(queue: .main) {
      if let spo2 = payload["spo2Percent"] as? Double, spo2 <= 1 {
        payload["spo2Percent"] = spo2 * 100
      }
      var effects: [[String: Any]] = []
      if let puff {
        for (key, window) in windows {
          if let before = window.before, let after = window.after {
            effects.append([
              "key": key,
              "before": before * window.scale,
              "after": after * window.scale,
              "puffAt": Int(puff.timeIntervalSince1970 * 1000),
            ])
          }
        }
      }
      payload["effects"] = effects
      writePayload(payload)
    }
  }

  private static func todayKey() -> String {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = TimeZone.current
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.string(from: Date())
  }
}
