package se.sncab.atsnative

import android.content.ContentUris
import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Files and updates for ATS:
//  - saveDownload / listDownloads: the documents ATS saves in Download/ATS (MediaStore, no storage permission needed)
//  - readBase64: reads a document the person picked (content:// or file://)
//  - verifyUpdate … clearUpdateNotice: checks and installs a new version, as in Alif
class AtsNativeModule : Module() {
  private val ctx: Context get() = appContext.reactContext ?: throw Exception("No context")
  private val folder = "Download/ATS"

  override fun definition() = ModuleDefinition {
    Name("AtsNative")

    AsyncFunction("saveDownload") { name: String, base64: String, mime: String ->
      if (Build.VERSION.SDK_INT < 29) throw Exception("android10")
      val r = ctx.contentResolver
      val values = ContentValues().apply {
        put(MediaStore.Downloads.DISPLAY_NAME, name)
        put(MediaStore.Downloads.MIME_TYPE, mime)
        put(MediaStore.Downloads.RELATIVE_PATH, folder)
        put(MediaStore.Downloads.IS_PENDING, 1)
      }
      val uri = r.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values) ?: throw Exception("insert failed")
      try {
        r.openOutputStream(uri)?.use { it.write(Base64.decode(base64, Base64.DEFAULT)) } ?: throw Exception("no stream")
        r.update(uri, ContentValues().apply { put(MediaStore.Downloads.IS_PENDING, 0) }, null, null)
      } catch (e: Exception) {
        try { r.delete(uri, null, null) } catch (_: Exception) {}
        throw e
      }
      var saved = name
      r.query(uri, arrayOf(MediaStore.Downloads.DISPLAY_NAME), null, null, null)?.use { c -> if (c.moveToFirst()) saved = c.getString(0) ?: name }
      mapOf("uri" to uri.toString(), "name" to saved)
    }

    AsyncFunction("listDownloads") {
      val out = mutableListOf<Map<String, Any?>>()
      if (Build.VERSION.SDK_INT < 29) return@AsyncFunction out
      val cols = arrayOf(MediaStore.Downloads._ID, MediaStore.Downloads.DISPLAY_NAME, MediaStore.Downloads.SIZE, MediaStore.Downloads.DATE_MODIFIED)
      ctx.contentResolver.query(
        MediaStore.Downloads.EXTERNAL_CONTENT_URI, cols,
        "${MediaStore.Downloads.RELATIVE_PATH} LIKE ?", arrayOf("$folder/%"),
        "${MediaStore.Downloads.DATE_MODIFIED} DESC"
      )?.use { c ->
        while (c.moveToNext()) {
          val id = c.getLong(0)
          val name = c.getString(1) ?: continue
          val lower = name.lowercase()
          if (!lower.endsWith(".docx") && !lower.endsWith(".odt")) continue
          out.add(mapOf(
            "uri" to ContentUris.withAppendedId(MediaStore.Downloads.EXTERNAL_CONTENT_URI, id).toString(),
            "name" to name, "size" to c.getLong(2), "modified" to c.getLong(3) * 1000
          ))
        }
      }
      out
    }

    AsyncFunction("readBase64") { uri: String ->
      val u = if (uri.startsWith("/")) Uri.parse("file://$uri") else Uri.parse(uri)
      val bytes = ctx.contentResolver.openInputStream(u)?.use { it.readBytes() } ?: throw Exception("cannot read")
      Base64.encodeToString(bytes, Base64.NO_WRAP)
    }

    Function("markUpdatePending") { title: String, body: String, channel: String -> AtsUpdate.markPending(ctx, title, body, channel) }
    AsyncFunction("verifyUpdate") { path: String, sha256: String? -> AtsUpdate.verify(ctx, path, sha256) }
    Function("canInstallPackages") { AtsUpdate.canInstall(ctx) }
    Function("openInstallPermission") { AtsUpdate.openInstallPermission(ctx) }
    Function("clearUpdateNotice") { AtsUpdate.clearNotice(ctx) }
  }
}
