
const quicksort = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }

    return [...quicksort(leftArr), pivot, ...quicksort(rightArr)];
}


let unordered = [3, 1, 6, 2, 4, 0];

let ordered = quicksort(unordered);
console.log(ordered);