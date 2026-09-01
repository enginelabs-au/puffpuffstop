import AppIntents
import os

@available(iOS 16.0, *)
enum VoiceQuickLog {
  static let log = Logger(subsystem: "au.com.enginelabs.puffpuffstop", category: "voice")

  static func apply(action: String, count: Int, spoken: String? = nil) -> VoiceSnapshotStatus {
    let resolved = action == "clear" ? "clear" : action
    let parsed = spoken.flatMap(VoiceSnapshot.parseSpokenCount)
    let amount = resolved == "clear" ? 1 : VoiceSnapshot.clampCount(parsed ?? max(1, count))
    Self.log.info("apply \(resolved, privacy: .public) count=\(amount, privacy: .public) spoken=\(spoken ?? "", privacy: .public)")
    let status = VoiceSnapshot.apply(direction: resolved, amount: amount)
    VoiceSnapshot.writePending(
      action: resolved,
      count: resolved == "clear" ? 0 : amount,
      applied: status.isOk
    )
    return status
  }
}

@available(iOS 16.0, *)
struct LogPuffIntent: AppIntent {
  static var title: LocalizedStringResource = "Log puff"
  static var description = IntentDescription("Log one puff.")
  static var openAppWhenRun = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    let status = await MainActor.run { VoiceQuickLog.apply(action: "up", count: 1) }
    return .result(dialog: IntentDialog(stringLiteral: VoiceSnapshot.spokenResult(direction: "up", status: status)))
  }
}

@available(iOS 16.0, *)
struct LogPuffsIntent: AppIntent {
  static var title: LocalizedStringResource = "Log this many"
  static var description = IntentDescription("Log a specific number of puffs.")
  static var openAppWhenRun = false
  static var parameterSummary: some ParameterSummary {
    Summary("Log \(\.$count) puffs")
  }

  @Parameter(title: "Count", default: LogCountChoice.n1)
  var count: LogCountChoice

  func perform() async throws -> some IntentResult & ProvidesDialog {
    let amount = count.rawValue
    let status = await MainActor.run {
      VoiceQuickLog.apply(action: "up", count: amount, spoken: String(amount))
    }
    return .result(dialog: IntentDialog(stringLiteral: VoiceSnapshot.spokenResult(direction: "up", status: status)))
  }
}

@available(iOS 16.0, *)
enum VoiceVerb: String, AppEnum {
  case reset
  case clear

  static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Voice action")
  static var caseDisplayRepresentations: [VoiceVerb: DisplayRepresentation] = [
    .reset: "Reset",
    .clear: "Clear",
  ]
}

@available(iOS 16.0, *)
struct VoiceVerbIntent: AppIntent {
  static var title: LocalizedStringResource = "Adjust puff log"
  static var description = IntentDescription("Undo one puff or reset today's log.")
  static var openAppWhenRun = false
  static var parameterSummary: some ParameterSummary {
    Summary("\(\.$verb) in PuffPuffStop")
  }

  @Parameter(title: "Action", default: VoiceVerb.reset)
  var verb: VoiceVerb

  func perform() async throws -> some IntentResult & ProvidesDialog {
    let status = await MainActor.run { VoiceQuickLog.apply(action: "clear", count: 0) }
    return .result(dialog: IntentDialog(stringLiteral: VoiceSnapshot.spokenResult(direction: "clear", status: status)))
  }
}

@available(iOS 16.0, *)
struct UndoPuffIntent: AppIntent {
  static var title: LocalizedStringResource = "Remove puff"
  static var description = IntentDescription("Remove one puff.")
  static var openAppWhenRun = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    let status = await MainActor.run { VoiceQuickLog.apply(action: "down", count: 1) }
    return .result(dialog: IntentDialog(stringLiteral: VoiceSnapshot.spokenResult(direction: "down", status: status)))
  }
}

@available(iOS 16.0, *)
struct RemoveSpokenPuffsIntent: AppIntent {
  static var title: LocalizedStringResource = "Remove spoken puffs"
  static var description = IntentDescription("Remove 5 puffs, 1 puff, or a puff.")
  static var openAppWhenRun = false
  static var parameterSummary: some ParameterSummary {
    Summary("Remove \(\.$count) puffs")
  }

  @Parameter(title: "Count", default: RemoveCountChoice.n1)
  var count: RemoveCountChoice

  func perform() async throws -> some IntentResult & ProvidesDialog {
    let amount = count.rawValue
    let status = await MainActor.run {
      VoiceQuickLog.apply(action: "down", count: amount, spoken: String(amount))
    }
    return .result(dialog: IntentDialog(stringLiteral: VoiceSnapshot.spokenResult(direction: "down", status: status)))
  }
}

@available(iOS 16.0, *)
struct UndoAllPuffsIntent: AppIntent {
  static var title: LocalizedStringResource = "Reset today's puffs"
  static var description = IntentDescription("Clear every puff logged today.")
  static var openAppWhenRun = false

  func perform() async throws -> some IntentResult & ProvidesDialog {
    let status = await MainActor.run { VoiceQuickLog.apply(action: "clear", count: 0) }
    return .result(dialog: IntentDialog(stringLiteral: VoiceSnapshot.spokenResult(direction: "clear", status: status)))
  }
}

@available(iOS 16.0, *)
struct PuffPuffStopShortcuts: AppShortcutsProvider {
  @AppShortcutsBuilder
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: RemoveSpokenPuffsIntent(),
      phrases: [
        "Remove \(\.$count) puffs from \(.applicationName)",
        "Remove \(\.$count) puff from \(.applicationName)",
        "Remove \(\.$count) puffs in \(.applicationName)",
        "Remove \(\.$count) puff in \(.applicationName)",
        "Remove \(\.$count) puffs to \(.applicationName)",
        "Remove \(\.$count) puff to \(.applicationName)",
        "Undo \(\.$count) puffs from \(.applicationName)",
        "Undo \(\.$count) puffs to \(.applicationName)",
        "Subtract \(\.$count) puffs from \(.applicationName)",
        "Subtract \(\.$count) puffs to \(.applicationName)",
      ],
      shortTitle: "Remove puffs",
      systemImageName: "minus.circle"
    )
    AppShortcut(
      intent: UndoPuffIntent(),
      phrases: [
        "Remove a puff from \(.applicationName)",
        "Remove a puff in \(.applicationName)",
        "Remove a puff to \(.applicationName)",
        "Remove one puff from \(.applicationName)",
        "Remove one puff in \(.applicationName)",
        "Remove one puff to \(.applicationName)",
        "Undo a puff from \(.applicationName)",
        "Undo a puff in \(.applicationName)",
        "Undo a puff to \(.applicationName)",
        "Subtract a puff to \(.applicationName)",
      ],
      shortTitle: "Take one off",
      systemImageName: "minus.circle"
    )
    AppShortcut(
      intent: LogPuffIntent(),
      phrases: [
        "Add a puff in \(.applicationName)",
        "Add a puff from \(.applicationName)",
        "Add a puff to \(.applicationName)",
        "Log a puff in \(.applicationName)",
        "Log a puff from \(.applicationName)",
        "Log a puff to \(.applicationName)",
        "Add one puff in \(.applicationName)",
        "Add one puff from \(.applicationName)",
        "Add one puff to \(.applicationName)",
        "Log one puff to \(.applicationName)",
      ],
      shortTitle: "Add a puff",
      systemImageName: "plus.circle"
    )
    AppShortcut(
      intent: UndoAllPuffsIntent(),
      phrases: [
        "Reset from \(.applicationName)",
        "Reset in \(.applicationName)",
        "Reset on \(.applicationName)",
        "Reset today's log from \(.applicationName)",
        "Reset today's log in \(.applicationName)",
        "Clear from \(.applicationName)",
        "Clear in \(.applicationName)",
        "Clear today's log from \(.applicationName)",
        "Wipe from \(.applicationName)",
        "Wipe today's log from \(.applicationName)",
      ],
      shortTitle: "Reset today",
      systemImageName: "trash"
    )
    AppShortcut(
      intent: VoiceVerbIntent(),
      phrases: [
        "\(\.$verb) from \(.applicationName)",
        "\(\.$verb) in \(.applicationName)",
        "\(\.$verb) to \(.applicationName)",
        "\(\.$verb) on \(.applicationName)",
      ],
      shortTitle: "Reset log",
      systemImageName: "trash"
    )
    AppShortcut(
      intent: LogPuffsIntent(),
      phrases: [
        "Add \(\.$count) puffs in \(.applicationName)",
        "Add \(\.$count) puffs from \(.applicationName)",
        "Add \(\.$count) puffs to \(.applicationName)",
        "Log \(\.$count) puffs in \(.applicationName)",
        "Log \(\.$count) puffs from \(.applicationName)",
        "Log \(\.$count) puffs to \(.applicationName)",
        "Add \(\.$count) puffs on \(.applicationName)",
        "Log \(\.$count) puffs on \(.applicationName)",
      ],
      shortTitle: "Log amount",
      systemImageName: "plus.circle"
    )
  }
}
