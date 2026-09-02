package au.com.enginelabs.puffpuffstop

import android.app.Activity
import android.os.Bundle
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.OxygenSaturationRecord
import androidx.health.connect.client.records.RespiratoryRateRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

class HealthConnectActivity : Activity() {
  private val permissions = setOf(
    HealthPermission.getReadPermission(HeartRateRecord::class),
    HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
    HealthPermission.getReadPermission(RespiratoryRateRecord::class),
    HealthPermission.getReadPermission(OxygenSaturationRecord::class),
  )

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val availability = HealthConnectClient.getSdkStatus(this)
    if (availability != HealthConnectClient.SDK_AVAILABLE) {
      write(JSONObject().put("status", "unavailable").put("source", "healthconnect"))
      finish()
      return
    }
    val refreshOnly = intent?.data?.host == "health-refresh"
    val client = HealthConnectClient.getOrCreate(this)
    val granted = runBlocking { client.permissionController.getGrantedPermissions() }
    if (refreshOnly && granted.containsAll(permissions)) {
      CoroutineScope(Dispatchers.IO).launch {
        readAroundLastPuff()
        runOnUiThread { finish() }
      }
      return
    }
    val request = PermissionController.createRequestPermissionResultContract()
      .createIntent(this, permissions)
    startActivityForResult(request, 71)
  }

  override fun onActivityResult(requestCode: Int, resultCode: Int, data: android.content.Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode != 71) {
      finish()
      return
    }
    CoroutineScope(Dispatchers.IO).launch {
      readAroundLastPuff()
      runOnUiThread { finish() }
    }
  }

  private fun lastPuffMs(): Long? {
    val file = File(filesDir, "puffpuffstop-snapshot.json")
    if (!file.exists()) return null
    return try {
      val daily = JSONObject(file.readText()).optJSONObject("dailyLog") ?: return null
      val times = daily.optJSONArray("puffAt") ?: return null
      if (times.length() == 0) return null
      times.optLong(times.length() - 1).takeIf { it > 0 }
    } catch (_: Exception) {
      null
    }
  }

  private suspend fun readAroundLastPuff() {
    val client = HealthConnectClient.getOrCreate(this)
    val end = Instant.now()
    val puffMs = lastPuffMs()
    val payload = JSONObject()
      .put("status", "ok")
      .put("source", "healthconnect")
      .put("syncedAt", DateTimeFormatter.ISO_INSTANT.format(end))
      .put("dateKey", DateTimeFormatter.ISO_LOCAL_DATE.format(ZonedDateTime.now()))
    val effects = JSONArray()

    suspend fun <T : androidx.health.connect.client.records.Record> records(
      clazz: kotlin.reflect.KClass<T>,
      start: Instant,
      finish: Instant,
    ): List<T> {
      return try {
        client.readRecords(ReadRecordsRequest(clazz, TimeRangeFilter.between(start, finish))).records
      } catch (_: Exception) {
        emptyList()
      }
    }

    val dayStart = ZonedDateTime.now().toLocalDate().atStartOfDay(ZoneId.systemDefault()).toInstant()
    val heart = records(HeartRateRecord::class, dayStart, end)
    heart.lastOrNull()?.samples?.lastOrNull()?.let {
      payload.put("heartRateBpm", it.beatsPerMinute)
    }
    records(HeartRateVariabilityRmssdRecord::class, dayStart, end).lastOrNull()?.let {
      payload.put("hrvMs", it.heartRateVariabilityMillis)
    }
    records(RespiratoryRateRecord::class, dayStart, end).lastOrNull()?.let {
      payload.put("respiratoryRate", it.rate)
    }
    records(OxygenSaturationRecord::class, dayStart, end).lastOrNull()?.let {
      payload.put("spo2Percent", it.percentage.value)
    }

    if (puffMs != null) {
      val puff = Instant.ofEpochMilli(puffMs)
      val beforeStart = puff.minusSeconds(20 * 60)
      val afterEnd = minOf(end, puff.plusSeconds(20 * 60))
      fun addEffect(key: String, before: Double?, after: Double?) {
        if (before != null && after != null) {
          effects.put(
            JSONObject()
              .put("key", key)
              .put("before", before)
              .put("after", after)
              .put("puffAt", puffMs),
          )
        }
      }
      val beforeHeart = records(HeartRateRecord::class, beforeStart, puff)
        .flatMap { it.samples }.lastOrNull()?.beatsPerMinute?.toDouble()
      val afterHeart = records(HeartRateRecord::class, puff, afterEnd)
        .flatMap { it.samples }.lastOrNull()?.beatsPerMinute?.toDouble()
      addEffect("heartRateBpm", beforeHeart, afterHeart)
      addEffect(
        "hrvMs",
        records(HeartRateVariabilityRmssdRecord::class, beforeStart, puff).lastOrNull()?.heartRateVariabilityMillis,
        records(HeartRateVariabilityRmssdRecord::class, puff, afterEnd).lastOrNull()?.heartRateVariabilityMillis,
      )
      addEffect(
        "respiratoryRate",
        records(RespiratoryRateRecord::class, beforeStart, puff).lastOrNull()?.rate,
        records(RespiratoryRateRecord::class, puff, afterEnd).lastOrNull()?.rate,
      )
      addEffect(
        "spo2Percent",
        records(OxygenSaturationRecord::class, beforeStart, puff).lastOrNull()?.percentage?.value,
        records(OxygenSaturationRecord::class, puff, afterEnd).lastOrNull()?.percentage?.value,
      )
    }

    payload.put("effects", effects)
    write(payload)
  }

  private fun write(payload: JSONObject) {
    if (!payload.has("syncedAt")) {
      payload.put("syncedAt", DateTimeFormatter.ISO_INSTANT.format(Instant.now()))
    }
    File(filesDir, "puffpuffstop-health.json").writeText(payload.toString())
  }
}
