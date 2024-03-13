const MAX_BORDER = Math.pow(2, -53);

function slideWindowNumber(hash, events) {
    let index = BigInt('0x' + hash.substring(0, 15));
    index = Number(index % BigInt(47));
    let num = BigInt('0x' + hash.substring(index, index + 14)) >> BigInt(3);
    num = Number(num) * MAX_BORDER;
    return num * events;
}


