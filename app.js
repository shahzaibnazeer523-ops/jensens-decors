// Database of products
const products = [
    {
        id: "p1",
        name: "Geometric Gold Grid",
        category: "Metal wall art",
        brand: "Gloster",
        price: "Pkr. 5,500",
        image: "assets/metal_art.png",
        shortDesc: "A stunning piece of geometric array suited for minimalistic interiors.",
        features: ["Material: Wrought Iron", "Finish: Gold Plated", "Dimensions: 30x40 inches", "Weight: 4 lbs"]
    },
    {
        id: "p2",
        name: "Vintage Botanicals",
        category: "Wall papers",
        brand: "Casa",
        price: "Pkr. 8500/roll",
        image: "assets/mirror_art.png",
        shortDesc: "Premium textured wallpaper featuring elegant floral patterns.",
        features: ["Material: Vinyl", "Type: Peel and Stick", "Coverage: 50 sq ft/roll", "Washable: Yes"]
    },
    {
        id: "p3",
        name: "Oakwood Trio Frames",
        category: "Photo frame art",
        brand: "Arttdinox",
        price: "Pkr. 12,000",
        image: "assets/photo_frame.png",
        shortDesc: "Set of three solid oak frames perfect for family portraits.",
        features: ["Material: Solid Oak", "Glass: Antiglare tempered", "Mounting: Vertical/Horizontal", "Sizes: 8x10, 5x7"]
    },
    {
        id: "p4",
        name: "Sunburst Brass Mirror",
        category: "Mirror art",
        brand: "Zenza",
        price: "Pkr. 29900",
        image: "assets/mirror_art.png",
        shortDesc: "Elegant round mirror encased in a premium brushed brass sunburst frame.",
        features: ["Material: Brass & Glass", "Diameter: 36 inches", "Style: Mid-Century Modern", "Hardware included: Yes"]
    },
    {
        id: "p5",
        name: "Invisible Float Shelf",
        category: "Wall shelves",
        brand: "Lofina",
        price: "Pkr. 6540",
        image: "assets/metal_art.png",
        shortDesc: "Sleek floating wooden shelves with hidden brackets.",
        features: ["Material: Walnut Wood", "Load Capacity: 20 lbs", "Dimensions: 24x6x2 inches", "Finish: Matte"]
    },
    {
        id: "p6",
        name: "Poly Stag Head",
        category: "Wall mounted animals",
        brand: "Gloster",
        price: "Pkr. 11000",
        image: "https://images.unsplash.com/photo-1544498308-f1c5cbaeadd6?auto=format&fit=crop&w=500&q=80",
        shortDesc: "Modern low-poly faux stag head in matte white.",
        features: ["Material: Resin", "Style: Geometric", "Color: Matte White", "Dimensions: 14x18 inches"]
    },
    {
        id: "p7",
        name: "Rustic Silver Leaves",
        category: "Metal wall art",
        brand: "Zenza",
        price: "Pkr. 19500",
        image: "assets/metal_art.png",
        shortDesc: "Intricate silver leaf pattern handmade by artisans.",
        features: ["Material: Stainless Steel", "Finish: Brushed Silver", "Dimensions: 40x20 inches"]
    },
    {
        id: "p8",
        name: "Modern Hexagon Mirror",
        category: "Mirror art",
        brand: "Gloster",
        price: "Pkr. 21000",
        image: "assets/mirror_art.png",
        shortDesc: "A statement piece featuring bevelled edges in a hexagon shape.",
        features: ["Material: Glass", "Shape: Hexagonal", "Dimensions: 28x28 inches", "Edge: Bevelled"]
    }
];

// Initialize on Load
async function init() {
    try {
        const response = await fetch('products.json');
        if (response.ok) {
            const data = await response.json();
            products.length = 0;
            products.push(...data);
        }
    } catch (error) {
        console.warn('products.json not found or unhappy, using local inline products', error);
    }

    populateBrands();
    populateCompareDropdowns();
    renderProducts(products);
    initMap();
}

document.addEventListener('DOMContentLoaded', init);

// Populate Brands dynamically
function populateBrands() {
    const brands = ["All", ...new Set(products.map(p => p.brand))];
    const brandFilter = document.getElementById("brandFilter");
    brandFilter.innerHTML = brands.map(b => `<option value="${b}">${b === 'All' ? 'All Brands' : b}</option>`).join('');
}

// Filter Function
function applyFilters() {
    const category = document.getElementById("categoryFilter").value;
    const brand = document.getElementById("brandFilter").value;

    const filtered = products.filter(p => {
        const catMatch = category === "All" || p.category === category;
        const brandMatch = brand === "All" || p.brand === brand;
        return catMatch && brandMatch;
    });

    renderProducts(filtered);
}

// Global scope filter via Nav links
window.filterByCategory = function(category) {
    document.getElementById("categoryFilter").value = category;
    document.getElementById("brandFilter").value = "All"; // Reset brand
    applyFilters();
};

// Render Products to DOM
function renderProducts(items) {
    const grid = document.getElementById("productGrid");
    
    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No products found matching your criteria.</p>`;
        return;
    }

    grid.innerHTML = items.map(p => {
        const imageSrc = p.image ? p.image : 'assets/metal_art.png';
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${imageSrc}" alt="${p.name}" class="card-img-top" style="height: 250px; object-fit: cover;" onerror="this.onerror=null; this.src='assets/metal_art.png';">
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <small class="text-muted">${p.brand} · ${p.category}</small>
                        </div>
                        <h5 class="card-title fw-bold">${p.name}</h5>
                        <p class="card-text text-muted flex-grow-1">${p.shortDesc}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="fw-bold text-primary fs-5">${p.price}</span>
                            <div>
                                <button class="btn btn-outline-primary btn-sm me-1" onclick="downloadFeatures('${p.id}')">
                                    <i class="bi bi-file-earmark-word"></i> Specs
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="downloadImage('${p.id}')">
                                    <i class="bi bi-download"></i> Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Word Document Blob Downloader
window.downloadFeatures = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const docHTML = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>${product.name} Features</title></head>
        <body style="font-family: Arial;">
            <h1>${product.name}</h1>
            <h3>Brand: ${product.brand} | Category: ${product.category}</h3>
            <h2>Detailed Features:</h2>
            <ul>
                ${product.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </body>
        </html>
    `;
    
    const blob = new Blob(['\ufeff', docHTML], {
        type: 'application/msword;charset=utf-8'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.name.replace(/\s+/g, '_')}_Features.doc`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Download product image as file
window.downloadImage = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.image) return;

    fetch(product.image)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${product.name.replace(/\s+/g, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        })
        .catch(error => alert('Cannot download image. Check that the image URL is valid.'));
};

// Compare Functionality
function populateCompareDropdowns() {
    const compare1 = document.getElementById("compare1");
    const compare2 = document.getElementById("compare2");
    
    const options = `<option value="">Select a Product</option>` + products.map(p => `<option value="${p.id}">${p.name} (${p.brand})</option>`).join('');
    
    compare1.innerHTML = options;
    compare2.innerHTML = options;
}

window.updateComparison = function() {
    const id1 = document.getElementById("compare1").value;
    const id2 = document.getElementById("compare2").value;
    const container = document.getElementById("compareResults");
    
    if (id1 && id2) {
        container.style.display = "grid";
        const p1 = products.find(p => p.id === id1);
        const p2 = products.find(p => p.id === id2);
        
        container.innerHTML = [p1, p2].map(p => `
            <div class="compare-card">
                <img src="${p.image}" alt="${p.name}">
                <h3 style="color:var(--primary); margin-bottom:1rem;">${p.name}</h3>
                <div class="compare-detail">
                    <span>Brand</span>
                    <strong>${p.brand}</strong>
                </div>
                <div class="compare-detail">
                    <span>Category</span>
                    <strong>${p.category}</strong>
                </div>
                <div class="compare-detail">
                    <span>Price</span>
                    <strong>${p.price}</strong>
                </div>
                <div class="compare-detail">
                    <span>Description</span>
                    <p style="font-size:0.9rem;">${p.shortDesc}</p>
                </div>
            </div>
        `).join('');
    } else {
        container.style.display = "none";
    }
};

// Geolocation and Leaflet Map
let map;
let defaultLat = 40.730610;
let defaultLng = -73.935242; // New York Default
let companyMarker;

function initMap() {
    // Basic initialization using standard coordinates
    map = L.map('map').setView([defaultLat, defaultLng], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    companyMarker = L.marker([defaultLat, defaultLng]).addTo(map)
        .bindPopup('<b>Jensen Headquarters</b><br>45th Avenue, New York').openPopup();
}

window.getUserLocation = function() {
    const msg = document.getElementById("geoMessage");
    
    if (navigator.geolocation) {
        msg.innerText = "Locating your position...";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Add user marker
                const userMarker = L.marker([userLat, userLng]).addTo(map)
                    .bindPopup('<b>Your Location</b>');

                // Adjust bounds to fit both
                const group = new L.featureGroup([companyMarker, userMarker]);
                map.fitBounds(group.getBounds().pad(0.2));
                
                // Basic straight line distance (Haversine formula approximation)
                const distance = getDistanceFromLatLonInKm(defaultLat, defaultLng, userLat, userLng);
                msg.innerHTML = `<span style="color:#5cb85c;">Found you!</span> You are approximately ${distance.toFixed(2)} km away from us.`;
            },
            (error) => {
                msg.innerHTML = `<span style="color:#d9534f;">Unable to fetch location: ${error.message}</span>`;
            }
        );
    } else {
        msg.innerHTML = "Geolocation is not supported by this browser.";
    }
};

// Helper distance function
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
