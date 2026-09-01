import Foundation

enum VoiceSnapshotStatus {
  case ok(todayTotal: Int, added: Int)
  case missing
  case failed

  var isOk: Bool {
    if case .ok = self { return true }
    return false
  }
}

enum VoiceSnapshot {
  static let fileName = "puffpuffstop-snapshot.json"
  static let pendingFileName = "puffpuffstop-voice-pending.json"
  static let maxCount = 999_999

  static func fileURL() -> URL {
    FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
      .appendingPathComponent(fileName)
  }

  static func pendingURL() -> URL {
    FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
      .appendingPathComponent(pendingFileName)
  }

  static func writePending(action: String, count: Int, applied: Bool = false) {
    let token = String(Int(Date().timeIntervalSince1970 * 1000))
    let cleared = action == "clear"
    let payload: [String: Any] = [
      "action": cleared ? "clear" : action,
      "count": cleared ? 0 : clampCount(count),
      "t": token,
      "applied": applied,
    ]
    guard let data = try? JSONSerialization.data(withJSONObject: payload) else { return }
    try? data.write(to: pendingURL(), options: .atomic)
  }

  static func todayKey(timeZoneId: String? = nil) -> String {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = timeZoneId.flatMap(TimeZone.init(identifier:)) ?? TimeZone.current
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.string(from: Date())
  }

  static func clampCount(_ value: Int) -> Int {
    min(maxCount, max(1, value))
  }

  static func parseSpokenCount(_ raw: String) -> Int? {
    let text = raw.lowercased()
    if let match = text.range(of: #"\d+"#, options: .regularExpression) {
      return Int(text[match]).map(clampCount)
    }
    let words: [(String, Int)] = [
      ("thousand", 1000), ("hundred", 100), ("ninety", 90), ("eighty", 80),
      ("seventy", 70), ("sixty", 60), ("fifty", 50), ("forty", 40),
      ("thirty", 30), ("twenty", 20), ("nineteen", 19), ("eighteen", 18),
      ("seventeen", 17), ("sixteen", 16), ("fifteen", 15), ("fourteen", 14),
      ("thirteen", 13), ("twelve", 12), ("eleven", 11), ("ten", 10),
      ("nine", 9), ("eight", 8), ("seven", 7), ("six", 6), ("five", 5),
      ("four", 4), ("three", 3), ("two", 2), ("one", 1), ("an", 1), ("a", 1),
    ]
    for (word, value) in words {
      if text.range(of: "\\b\(word)\\b", options: .regularExpression) != nil {
        return clampCount(value)
      }
    }
    return nil
  }

  static func spokenResult(direction: String, status: VoiceSnapshotStatus) -> String {
    switch status {
    case .missing:
      return "Open PuffPuffStop once first so I can save your log."
    case .failed:
      return "I could not save that puff. Try opening the app."
    case .ok(let todayTotal, let added):
      let addedWord = added == 1 ? "puff" : "puffs"
      let todayWord = todayTotal == 1 ? "puff" : "puffs"
      if direction == "clear" {
        return "Cleared today's log. That's \(todayTotal) \(todayWord) today."
      }
      if direction == "down" {
        return "Undone \(added) \(addedWord). That's \(todayTotal) \(todayWord) today."
      }
      return "Logged \(added) \(addedWord). That's \(todayTotal) \(todayWord) today."
    }
  }

  static func apply(direction: String, amount: Int = 1) -> VoiceSnapshotStatus {
    let url = fileURL()
    var added = clampCount(amount)
    guard FileManager.default.fileExists(atPath: url.path) else {
      return .missing
    }

    do {
      let data = try Data(contentsOf: url)
      guard var root = try JSONSerialization.jsonObject(with: data) as? [String: Any],
            var daily = root["dailyLog"] as? [String: Any]
      else {
        return .failed
      }

      let settings = root["settings"] as? [String: Any]
      let today = todayKey(timeZoneId: settings?["timeZone"] as? String)
      let dateKey = daily["dateKey"] as? String ?? ""
      var logged = 0
      if let number = daily["logged"] as? NSNumber {
        logged = number.intValue
      }
      if dateKey != today {
        daily["dateKey"] = today
        logged = 0
      }
      if direction == "clear" {
        added = logged
        logged = 0
      } else if direction == "down" {
        logged = max(0, logged - added)
      } else {
        logged += added
      }
      daily["logged"] = logged
      root["dailyLog"] = daily

      let out = try JSONSerialization.data(withJSONObject: root, options: [.prettyPrinted])
      try out.write(to: url, options: .atomic)
      return .ok(todayTotal: logged, added: added)
    } catch {
      return .failed
    }
  }
}
