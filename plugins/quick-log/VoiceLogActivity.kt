package au.com.enginelabs.puffpuffstop

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle

class VoiceLogActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val intentAction = intent?.action
    if (intentAction !in setOf(LOG_ACTION, UNDO_ACTION, CLEAR_ACTION)) {
      finish()
      return
    }
    val actionRaw = extraText("action") ?: intent?.data?.getQueryParameter("action")
    val countRaw = extraText("count") ?: intent?.data?.getQueryParameter("count")
    val parsedCount = parseCountOrNull()
    val payloadDirection = when {
      actionRaw == null -> null
      actionRaw in ADD_ACTIONS -> "up"
      actionRaw in SUB_ACTIONS -> "down"
      actionRaw in setOf("clear", "wipe", "everything", "reset") -> "clear"
      else -> {
        finish()
        return
      }
    }
    val payloadMatchesIntent = when (intentAction) {
      LOG_ACTION -> payloadDirection == null || payloadDirection == "up"
      UNDO_ACTION -> payloadDirection == null || payloadDirection == "down" || payloadDirection == "clear"
      CLEAR_ACTION -> payloadDirection == null || payloadDirection == "clear"
      else -> false
    }
    if (!payloadMatchesIntent) {
      finish()
      return
    }
    val direction = when (intentAction) {
      LOG_ACTION -> "up"
      UNDO_ACTION -> if (countRaw in CLEAR_COUNTS || payloadDirection == "clear") "clear" else "down"
      CLEAR_ACTION -> "clear"
      else -> return
    }
    val amount = if (direction == "clear") 0 else (parsedCount ?: 1)
    val result = VoiceSnapshot.apply(filesDir, direction, if (direction == "clear") 1 else amount)
    VoiceSnapshot.writePending(filesDir, direction, amount, result.status == "ok")
    if (result.status != "ok") {
      val token = System.currentTimeMillis().toString()
      val count = if (direction == "clear") "0" else amount.toString()
      val uri = Uri.parse("puffpuffstop://quick-log?action=$direction&count=$count&t=$token")
      startActivity(
        Intent(Intent.ACTION_VIEW, uri)
          .setPackage(packageName)
          .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP),
      )
    }
    finish()
  }

  private fun extraText(name: String): String? {
    return intent?.getStringExtra(name) ?: intent?.extras?.get(name)?.toString()
  }

  private fun parseCountOrNull(): Int? {
    val fromExtra = when (val raw = intent?.extras?.get("count")) {
      is Int -> raw
      is Long -> raw.toInt()
      is Double -> raw.toInt()
      is Float -> raw.toInt()
      is String -> firstInt(raw)
      else -> null
    }
    val fromData = firstInt(intent?.data?.getQueryParameter("count"))
    val value = fromExtra ?: fromData ?: return null
    return VoiceSnapshot.clampCount(value)
  }

  private fun firstInt(raw: String?): Int? {
    val match = raw?.let { Regex("""(\d+)""").find(it) } ?: return null
    return match.groupValues[1].toIntOrNull()
  }

  companion object {
    const val LOG_ACTION = "au.com.enginelabs.puffpuffstop.LOG_PUFF"
    const val UNDO_ACTION = "au.com.enginelabs.puffpuffstop.UNDO_PUFF"
    const val CLEAR_ACTION = "au.com.enginelabs.puffpuffstop.CLEAR_PUFFS"
    val ADD_ACTIONS = setOf("up", "log", "add", "include", "plus", "record", "increment")
    val SUB_ACTIONS = setOf(
      "down",
      "undo",
      "remove",
      "reduce",
      "subtract",
      "substract",
      "take-back",
      "take-away",
      "takeaway",
      "take-off",
      "takeoff",
      "revert",
      "decrease",
    )
    val CLEAR_COUNTS = setOf("all", "clear", "wipe", "everything")
  }
}
