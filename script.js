function filterProducts() {

    var brand = document.getElementById("brand").value;
    var result = "";

    if (brand == "Gloster") {
        result = "Gloster Mirror Art - Rs. 5,500 | Gloster Frames - Rs. 3,200";
    }
    else if (brand == "Urban Decor") {
        result = "Urban Wallpapers - Rs. 2,800 | Urban Shelves - Rs. 8,900";
    }
    else {
        result = "All Products Available<br>Mirror Art - Rs. 5,500 | Photo Frames - Rs. 3,200 | Wallpapers - Rs. 2,800 | Wall Shelves - Rs. 8,900";
    }

    document.getElementById("result").innerHTML = result;
}

function compare() {

    var p1 = document.getElementById("p1").value;
    var p2 = document.getElementById("p2").value;

    var output = "Comparing " + p1 + " with " + p2;

    document.getElementById("output").innerHTML = output;
}