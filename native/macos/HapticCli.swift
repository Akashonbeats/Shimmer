import AppKit
import Foundation

// Usage: HapticCli <pattern> [count] [intervalMs] [time]
// pattern: generic|alignment|levelChange|hover|level
// count: number of pulses (default 1)
// intervalMs: delay between pulses in ms (default 30)
// time: now|default|draw (default now)

let args = Array(CommandLine.arguments.dropFirst())

let patternArg = (args.first?.lowercased() ?? "generic")
let count = Int(args.dropFirst().first ?? "") ?? 1
let intervalMs = Int(args.dropFirst(2).first ?? "") ?? 30
let timeArg = (args.dropFirst(3).first?.lowercased() ?? "now")

let pattern: NSHapticFeedbackManager.FeedbackPattern
switch patternArg {
case "alignment", "hover": pattern = .alignment
case "level", "levelchange": pattern = .levelChange
default: pattern = .generic
}

let perfTime: NSHapticFeedbackManager.PerformanceTime = {
    switch timeArg {
    case "default": return .default
    case "draw", "drawcompleted": return .drawCompleted
    default: return .now
    }
}()

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
app.activate(ignoringOtherApps: false)

let performer = NSHapticFeedbackManager.defaultPerformer
for i in 0..<max(1, count) {
    let delay = DispatchTime.now() + .milliseconds(i * max(0, intervalMs))
    DispatchQueue.main.asyncAfter(deadline: delay) {
        performer.perform(pattern, performanceTime: perfTime)
    }
}

// Keep the runloop alive long enough to deliver all pulses
let total = Double(max(1, count) * max(0, intervalMs)) / 1000.0 + 0.15
RunLoop.current.run(until: Date().addingTimeInterval(total))