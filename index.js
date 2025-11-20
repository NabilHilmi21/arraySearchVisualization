const arrayBtn = document.getElementById("generateArrayBtn");
const arrayInput = document.getElementById("arrayInput");
const container = document.getElementById("arrayContainer");
const visualizationBtn = document.getElementById("visualizationBtn");
const targetInput = document.getElementById("targetInput");
const mySelect = document.getElementById("mySelect");

function generateArr(arrayInput){
    let rawValue = arrayInput.value;
    if (!rawValue) return [];

    let array = [];

    let pieces = rawValue.split(",");
    
    for (let p of pieces) {
        let removeSpace = p.trim();
        let convNum = Number(removeSpace);
        array.push(convNum);
    }

    return array;
}

function renderArray(array){
    container.innerHTML = "";
    let i = 0;

    for (arr of array){
        let box = document.createElement("div");
        box.classList.add(
            "p-4",
            `array-number-${i}`,
            "mt-2",
            "rounded-xl",
            "border",
            "text-center",
            "array-box"
        )
        box.textContent = arr;
        container.appendChild(box);

        i++;
    }
}

function resetColors(array){
    for (let i = 0; i < array.length; i++){
        let box = document.querySelector(`.array-number-${i}`);
        box.classList.remove(
            "bg-yellow-400",
            "bg-green-400",
            "bg-blue-400",
            "bg-red-400"
        );
    }
}

// buat delay
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}
async function visualLinearSearch(array, target){
    
    resetColors(array); // reset warna sebelum mulai

    // satu satu ngecek + visualisasi
    for (let i = 0; i < array.length; i++){
        let box = document.querySelector(`.array-number-${i}`);
        box.classList.add("bg-yellow-400");

        // await berarti nunggu sampai selesai
        await sleep(1500);
        if (array[i] === target){
            box.classList.remove("bg-yellow-400");
            box.classList.add("bg-green-400");
            return i;
        }
        box.classList.remove("bg-yellow-400");
    }
}

async function visualJumpSearch(array, target) {
    resetColors(array);

    let n = array.length;
    let step = Math.floor(Math.sqrt(n));  // jump size

    let prev = 0;
    let blockEnd = step;

    while (array[Math.min(blockEnd, n) - 1] < target) {

        // highlight the block end in blue
        let endBox = document.querySelector(`.array-number-${Math.min(blockEnd, n) - 1}`);
        endBox.classList.add("bg-blue-400");
        await sleep(1000);
        endBox.classList.remove("bg-blue-400");

        prev = blockEnd;
        blockEnd += step;

        if (prev >= n) return -1;
    }

    let lastJump = document.querySelector(`.array-number-${Math.min(blockEnd, n) - 1}`);
    lastJump.classList.add("bg-blue-400");
    await sleep(1000);
    lastJump.classList.remove("bg-blue-400");

    for (let i = prev; i < Math.min(blockEnd, n); i++) {
        let box = document.querySelector(`.array-number-${i}`);
        box.classList.add("bg-yellow-400");
        await sleep(700);

        if (array[i] === target) {
            box.classList.remove("bg-yellow-400");
            box.classList.add("bg-green-400");
            return i;
        }

        box.classList.remove("bg-yellow-400");
    }

    return -1;
}

async function visualBinarySearch(array, target){
    resetColors(array);

    let left = 0;
    let right = array.length - 1;

    while (left <= right){

        resetColors(array);

        let mid = Math.floor((left + right) / 2);

        let leftBox = document.querySelector(`.array-number-${left}`);
        let rightBox = document.querySelector(`.array-number-${right}`);
        let midBox = document.querySelector(`.array-number-${mid}`);

        // Overlap rules
        if (left === right && right === mid){
            midBox.classList.add("bg-yellow-400"); // mid priority
        }
        else if (left === mid){
            leftBox.classList.add("bg-yellow-400");
            rightBox.classList.add("bg-red-400");
        }
        else if (right === mid){
            rightBox.classList.add("bg-yellow-400");
            leftBox.classList.add("bg-blue-400");
        }
        else {
            leftBox.classList.add("bg-blue-400");
            rightBox.classList.add("bg-red-400");
            midBox.classList.add("bg-yellow-400");
        }

        await sleep(2000);

        // Found → ALWAYS GREEN
        if (array[mid] === target){
            resetColors(array);
            midBox.classList.add("bg-green-400");
            return mid;
        }

        // move window
        if (array[mid] < target){
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    resetColors(array);
    return -1;
}

function sortArray(array){
    return array.sort((a, b) => a - b);
}

function visualSorted(array){
    let sortedArray = sortArray(array);
    renderArray(sortedArray);
    return sortedArray;
}

function chooseMethod(array, target, method) {
    if (array.length === 0) {
        container.innerHTML = "<p class='text-red-500'>Please enter a valid array.</p>";
        return;
    }

    if (isNaN(target)) {
        container.innerHTML = "<p class='text-red-500'>Please enter a valid target value.</p>";
        return;
    }

    if (method === "") {
        container.innerHTML = "<p class='text-red-500'>Please select a search method.</p>";
        return;
    }

    if (method === "1") {
        renderArray(array);
        visualLinearSearch(array, target);
        addDescription(method);
    } 
    else if (method === "2") {
        let sortedArray = visualSorted(array);
        visualBinarySearch(sortedArray, target);
        addDescription(method); 
    } 
    else if (method === "3") {
        let sortedArray = visualSorted(array);
        visualJumpSearch(sortedArray, target);
        addDescription(method);
    } 
    else {
        container.innerHTML = "<p class='text-red-500'>Please select a valid search method.</p>";
    }
}

let codeContainer = document.getElementById("codeContainer");

function showCodes(method, lang){

    if (method ==="" && lang === ""){
        codeContainer.innerHTML = "<p class='text-red-500'>Please select a valid search method and programming language.</p>";
        return;
    } else if (lang === ""){
        codeContainer.innerHTML = "<p class='text-red-500'>Please select a valid programming language.</p>";
        return;
    } else if (method === ""){
        codeContainer.innerHTML = "<p class='text-red-500'>Please select a valid search method.</p>";
        return;
    } else {
        // Clear previous code
        codeContainer.innerHTML = "";
        // Create a box to show code
        let codeBox = document.createElement("div");
        codeBox.classList.add(
            "rounded-xl",
            "bg-neutral-800",
            "p-4",
            "whitespace-pre-wrap",
            "font-mono",
            "text-white"
        );
        codeContainer.appendChild(codeBox);
        // Fetch code from appropriate file
        let filePath = `codes/method${method}_lang${lang}.txt`;
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("File not found");
                }
                return response.text();
            })
            .then(code => {
                codeBox.textContent = code;
            })
            .catch(error => {
                codeBox.textContent = "Code not available for the selected method and language.";
            });

    }
}

let descriptionContainer = document.getElementById("descriptionContainer");

function addDescription(method){
    descriptionContainer.innerHTML = "";
    
    if (method === "1"){
        let textBox = document.createElement("div");
        textBox.classList.add(
            "rounded-xl",
            "bg-gray-100",
            "p-4",
            "mt-4",
            "space-y-4"
        );
        textBox.innerHTML = "<h2 class='text-2xl font-semibold'>Linear Search</h2><p class='text-gray-500'>Linear Search adalah algoritma pencarian yang memeriksa setiap elemen dalam array satu per satu hingga menemukan elemen yang dicari atau mencapai akhir array. Algoritma ini memiliki kompleksitas waktu O(n) karena dalam kasus terburuk, semua elemen harus diperiksa.</p>";
        descriptionContainer.appendChild(textBox);

        let legend = document.createElement("div");
        legend.classList.add(
            "flex",
            "flex-column",
            "flex-wrap",
            "space-y-2",
            "md:space-y-0"
        )
        legend.innerHTML = "<span class='bg-yellow-400 px-2 py-1 rounded-xl mr-2'>Current Element</span><span class='bg-green-400 px-2 py-1 rounded-xl mr-2'>Found Element</span>";
        textBox.appendChild(legend);
    } else if (method === "2"){
        let textBox = document.createElement("div");
        textBox.classList.add(
            "rounded-xl",
            "bg-gray-100",
            "p-4",
            "mt-4",
            "space-y-4"
        );
        textBox.innerHTML = "<h2 class='text-2xl font-semibold'>Binary Search</h2><p class='text-gray-500'>Binary Search adalah algoritma pencarian efisien yang bekerja pada array yang sudah diurutkan. Algoritma ini membagi ruang pencarian menjadi dua bagian setiap kali, sehingga kompleksitas waktunya adalah O(log n). Namun, Binary Search hanya dapat digunakan pada array yang telah diurutkan sebelumnya.</p>";
        descriptionContainer.appendChild(textBox);

        let legend = document.createElement("div");
        legend.classList.add(
            "flex",
            "flex-column",
            "flex-wrap",
            "space-y-2",
            "md:space-y-0"  
        )
        legend.innerHTML = "<span class='bg-blue-400 px-2 py-1 rounded-xl mr-2'>Left Bound</span><span class='bg-red-400 px-2 py-1 rounded-xl mr-2'>Right Bound</span><span class='bg-yellow-400 px-2 py-1 rounded-xl mr-2'>Mid Element</span><span class='bg-green-400 px-2 py-1 rounded-xl mr-2'>Found Element</span>";
        textBox.appendChild(legend);
    } else if (method === "3"){ 
        let textBox = document.createElement("div");
        textBox.classList.add(
            "rounded-xl",
            "bg-gray-100",
            "p-4",
            "mt-4",
            "space-y-4"
        );
        textBox.innerHTML = "<h2 class='text-2xl font-semibold'>Jump Search</h2><p class='text-gray-500'>Jump Search adalah algoritma pencarian yang bekerja pada array yang sudah diurutkan dengan melompat sejumlah elemen tertentu (ukuran lompatan) dan kemudian melakukan pencarian linear dalam blok tersebut. Kompleksitas waktu algoritma ini adalah O(√n), yang lebih efisien daripada Linear Search tetapi kurang efisien dibandingkan Binary Search.</p>";
        descriptionContainer.appendChild(textBox);

        let legend = document.createElement("div");
        legend.classList.add(
            "flex",
            "flex-column",
            "flex-wrap",
            "space-y-2",
            "md:space-y-0"
        )
        legend.innerHTML = "<span class='bg-blue-400 px-2 py-1 rounded-xl mr-2'>Block End</span><span class='bg-yellow-400 px-2 py-1 rounded-xl mr-2'>Current Element</span><span class='bg-green-400 px-2 py-1 rounded-xl mr-2'>Found Element</span>";
        textBox.appendChild(legend);
    }
}

visualizationBtn.addEventListener("click", function(){
    let array = generateArr(arrayInput);
    let targetValue = Number(targetInput.value);
    let method = mySelect.value;

    chooseMethod(array, targetValue, method);
});

arrayBtn.addEventListener("click", function(){
    let array = generateArr(arrayInput);
    if (array.length === 0){
        container.innerHTML = "<p class='text-red-500'>Please enter valid numbers separated by commas.</p>";
        return;
    };
    renderArray(array);
});

const showCodeBtn = document.getElementById("showCodeBtn");
const selectShow = document.getElementById("selectShow");
const selectLang = document.getElementById("selectLang");

showCodeBtn.addEventListener("click", function(){
    let method = selectShow.value;
    let lang = selectLang.value;
    showCodes(method, lang);
});