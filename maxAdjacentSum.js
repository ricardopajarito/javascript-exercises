let a = [3, 7, 5, 6, 2];

function maxAdjacentSum(array) {
    let maxSum = -Infinity;
    const { length } = array;

    for (let index = 0; index < length - 1; index++) {
        const sum = array[index] + array[index + 1];
        maxSum = Math.max(maxSum, sum);
    }

    return maxSum;
}


console.log(maxAdjacentSum(a));
