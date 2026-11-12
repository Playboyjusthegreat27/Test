// Guard week lock checks against missing or incomplete week metadata.
(function () {
  function safeWeekIsLocked(name) {
    var loaded = typeof backend_WeekData !== "undefined" &&
      backend_WeekData.weeksLoaded && backend_WeekData.weeksLoaded.h;
    var leWeek = loaded && loaded[name];

    // Freeplay expects every unlocked week to contain a songs array.
    // Treat incomplete week entries as unavailable so create() skips them.
    if (!leWeek || !Array.isArray(leWeek.songs)) return true;
    if (leWeek.startUnlocked) return false;

    var before = leWeek.weekBefore;
    if (typeof before !== "string" || before.length === 0) return false;

    var completed = typeof states_StoryMenuState !== "undefined" &&
      states_StoryMenuState.weekCompleted &&
      states_StoryMenuState.weekCompleted.h;

    if (completed && Object.prototype.hasOwnProperty.call(completed, before)) {
      return !completed[before];
    }
    return true;
  }

  if (typeof states_FreeplayState !== "undefined" &&
      states_FreeplayState.prototype) {
    states_FreeplayState.prototype.weekIsLocked = safeWeekIsLocked;
  }

  if (typeof states_StoryMenuState !== "undefined" &&
      states_StoryMenuState.prototype) {
    states_StoryMenuState.prototype.weekIsLocked = safeWeekIsLocked;
  }
})();
