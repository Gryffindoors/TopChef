export const unitLabel = (unit) => {
  switch (unit) {
    case "kg":
      return "كجم"
    case "tray":
      return "صينية"
    case "piece":
      return "قطعة"
    default:
      return unit
  }
}