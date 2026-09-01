package au.com.enginelabs.puffpuffstop

import org.json.JSONObject
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

object VoiceSnapshot {
  const val FILE_NAME = "puffpuffstop-snapshot.json"
  const val PENDING_FILE_NAME = "puffpuffstop-voice-pending.json"
  const val MAX_COUNT = 999_999

  data class Result(val status: String, val todayTotal: Int, val added: Int) {
    fun spoken(direction: String): String {
      if (status == "missing") {
        return "Open PuffPuffStop once first so I can save your log."
      }
      if (status == "failed") {
        return "I could not save that puff. Try opening the app."
      }
      val addedWord = if (added == 1) "puff" else "puffs"
      val todayWord = if (todayTotal == 1) "puff" else "puffs"
      if (direction == "clear") {
        return "Cleared today's log. That's $todayTotal $todayWord today."
      }
      return if (direction == "down") {
        "Undone $added $addedWord. That's $todayTotal $todayWord today."
      } else {
        "Logged $added $addedWord. That's $todayTotal $todayWord today."
      }
    }
  }

  fun clampCount(value: Int): Int = value.coerceIn(1, MAX_COUNT)

  fun writePending(filesDir: File, action: String, count: Int, applied: Boolean = false) {
    val cleared = action == "clear"
    val payload = JSONObject()
      .put("action", if (cleared) "clear" else action)
      .put("count", if (cleared) 0 else clampCount(count))
      .put("t", System.currentTimeMillis().toString())
      .put("applied", applied)
    File(filesDir, PENDING_FILE_NAME).writeText(payload.toString())
  }

  fun todayKey(timeZoneId: String? = null): String {
    val formatter = SimpleDateFormat("yyyy-MM-dd", Locale.US)
    formatter.timeZone =
      timeZoneId?.takeIf { it.isNotBlank() }?.let { TimeZone.getTimeZone(it) }
        ?: TimeZone.getDefault()
    return formatter.format(Date())
  }

  fun apply(filesDir: File, direction: String, amount: Int = 1): Result {
    val added = clampCount(amount)
    val file = File(filesDir, FILE_NAME)
    if (!file.exists()) {
      return Result("missing", 0, added)
    }
    return try {
      val root = JSONObject(file.readText())
      val daily = root.optJSONObject("dailyLog") ?: return Result("failed", 0, added)
      val today = todayKey(root.optJSONObject("settings")?.optString("timeZone"))
      val dateKey = daily.optString("dateKey", "")
      var logged = daily.optInt("logged", 0)
      if (dateKey != today) {
        daily.put("dateKey", today)
        logged = 0
      }
      if (direction == "clear") {
        logged = 0
      } else {
        logged = if (direction == "down") maxOf(0, logged - added) else logged + added
      }
      daily.put("logged", logged)
      root.put("dailyLog", daily)
      file.writeText(root.toString(2))
      Result("ok", logged, added)
    } catch (_: Exception) {
      Result("failed", 0, added)
    }
  }
}
