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
    //if the very last character is a ., append a 0 to make it number-acceptable and return it
    if (value.toString()[value.toString().length - 1] === "."){
      value = value.toString() + "0";

      return value;
    }

    //if we try to type a number, let's say a 5, when the first decimal place is a 0 (like 12.0) then it will type it as 12.05
    //this function will replace that .05 and turn it into a .5 so that it reads 12.5 as the user types it in
    if (value.toString()[value.toString().length - 3] === "." && value.toString()[value.toString().length - 2] === "0" ){
      value = value.toString().split(".")[0] + "." + value.toString().split(".")[1].substring(1);
    }

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
