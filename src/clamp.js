/**
 * this function takes an input value, a min, and a max, and returns a number that is
 * clamped between the min and max values. It will also filter non-numeric inputs and
 * return the min value if one is detected
 * @param {*} value the value to clamp
 * @param {*} min the minimum value to allow or return on an invalid input
 * @param {*} max the maximum value to allow
 * @returns the clamped number
 */
export function clamp(value, min = 0, max = 100000) {
    //first check if value is a number
    if (isNaN(Number(value))) {
      return Number(min);
    }

    //if all is ok, do regular clamping
    if (Number(value) < Number(min)) {
      return Number(min);
    } else if (Number(value) > Number(max)) {
      return Number(max);
    }

    return Number(value);
}
