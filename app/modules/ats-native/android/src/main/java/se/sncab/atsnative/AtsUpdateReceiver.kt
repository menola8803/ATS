package se.sncab.atsnative

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Opens ATS again after an update that ATS itself started. */
class AtsUpdateReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == Intent.ACTION_MY_PACKAGE_REPLACED) AtsUpdate.afterReplaced(context)
  }
}
