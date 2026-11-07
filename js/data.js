/**
 * LUSSO BISTRO & BAR - Bar Cost & Stok Yönetim Modülü
 * Başlangıç Veri Seti ve Konfigürasyonlar
 */

const DEFAULT_COCKTAILS = [
    {
        id: "lusso-citrus-mint",
        name: "Lusso Citrus Mint Cooler",
        tagline: "Ferahlatıcı Akdeniz Esintisi",
        category: "İmza Kokteyller",
        glass: "Highball / Collins Glass",
        garnish: "Dehidre Limon & Taze Nane Buketi",
        alcoholVolume: "50 ml",
        totalVolume: "175 ml",
        unitCost: 58.40,
        salesPrice: 380.00,
        dailyOrders: 68,
        wasteRisk: "Düşük",
        ingredients: [
            { name: "Premium Dry Gin", amount: "50 ml", unitCost: 41.50 },
            { name: "Taze Sıkım Limon Suyu", amount: "25 ml", unitCost: 6.20 },
            { name: "Ev Yapımı Nane Şurubu", amount: "20 ml", unitCost: 4.50 },
            { name: "Zanaatkar Maden Suyu (Soda)", amount: "80 ml", unitCost: 4.20 },
            { name: "Garnitür & Kristal Buz", amount: "1 porsiyon", unitCost: 2.00 }
        ],
        notes: "Günde ortalama 60+ adet satan yüksek süratli, düşük maliyetli yıldız ürün."
    },
    {
        id: "mediterranean-apple-sour",
        name: "Mediterranean Apple Sour",
        tagline: "Dengeli Asidite & İpeksi Doku",
        category: "Ekşi & Meyveli",
        glass: "Coupe Glass",
        garnish: "Karamelize Yeşil Elma Dilimi & Angostura Damlası",
        alcoholVolume: "50 ml",
        totalVolume: "135 ml",
        unitCost: 72.80,
        salesPrice: 420.00,
        dailyOrders: 54,
        wasteRisk: "Orta (Yumurta akı / foamer)",
        ingredients: [
            { name: "Yeşil Elma Likörü & Votka Blend", amount: "50 ml", unitCost: 48.00 },
            { name: "Ekşi Yeşil Elma Püresi", amount: "25 ml", unitCost: 9.50 },
            { name: "Taze Misket Limonu (Lime) Suyu", amount: "20 ml", unitCost: 6.80 },
            { name: "Organik Yumurta Akı / Vegan Foamer", amount: "15 ml", unitCost: 5.00 },
            { name: "Garnitür & Aromatik Damlalar", amount: "1 porsiyon", unitCost: 3.50 }
        ],
        notes: "Dry shake sonrası buzlu çalkalama ile ipeksi köpük oluşturulur."
    },
    {
        id: "riviera-strawberry-smash",
        name: "Riviera Strawberry Smash",
        tagline: "Tatlı Çilek & Taze Fesleğen Uyumu",
        category: "İmza Kokteyller",
        glass: "Old Fashioned / Rocks Glass",
        garnish: "Taze Çilek Dilimi & Taze İtalyan Fesleğeni",
        alcoholVolume: "50 ml",
        totalVolume: "140 ml",
        unitCost: 64.20,
        salesPrice: 390.00,
        dailyOrders: 62,
        wasteRisk: "Orta (Taze meyve püresi)",
        ingredients: [
            { name: "Havana Club Añejo 3 Años (Beyaz Rom)", amount: "50 ml", unitCost: 44.00 },
            { name: "Taze Tarla Çileği Püresi", amount: "30 ml", unitCost: 8.50 },
            { name: "Ev Yapımı Fesleğen Şurubu", amount: "20 ml", unitCost: 4.20 },
            { name: "Taze Sıkılmış Misket Limonu Suyu", amount: "20 ml", unitCost: 5.50 },
            { name: "Kırık Buz & Garnitür", amount: "1 porsiyon", unitCost: 2.00 }
        ],
        notes: "Garnitür fesleğen avuç içinde patlatılarak bardağa eklenir."
    },
    {
        id: "lusso-velvet-espresso",
        name: "Lusso Velvet Espresso",
        tagline: "Zengin Kahve & Kadifemsi Yoğunluk",
        category: "Tatlı & Digestif",
        glass: "Nick & Nora / Martini Glass",
        garnish: "3 Adet Kavrulmuş Kahve Çekirdeği (Sağlık, Mutluluk, Zenginlik)",
        alcoholVolume: "70 ml",
        totalVolume: "130 ml",
        unitCost: 86.50,
        salesPrice: 440.00,
        dailyOrders: 48,
        wasteRisk: "Düşük",
        ingredients: [
            { name: "Premium Tahıl Votkası", amount: "45 ml", unitCost: 38.50 },
            { name: "Kahlúa Kahve Likörü", amount: "25 ml", unitCost: 24.50 },
            { name: "Taze Çekilmiş Single Origin Espresso", amount: "30 ml", unitCost: 14.50 },
            { name: "Madagaskar Vanilya Şurubu", amount: "10 ml", unitCost: 6.00 },
            { name: "Buz & Kahve Çekirdeği Garnitürü", amount: "1 porsiyon", unitCost: 3.00 }
        ],
        notes: "Espresso sıcakken çalkalanarak kalın krema katmanı elde edilir."
    },
    {
        id: "alanya-citrus-sparkle",
        name: "Alanya Citrus Sparkle",
        tagline: "Akdeniz Kan Portakalı & Köpüklü Şarap",
        category: "İmza Kokteyller",
        glass: "Flute / Geniş Kadeh",
        garnish: "Kurutulmuş Kan Portakalı & Altın Tozu (Gold Dust)",
        alcoholVolume: "65 ml",
        totalVolume: "165 ml",
        unitCost: 98.60,
        salesPrice: 480.00,
        dailyOrders: 42,
        wasteRisk: "Yüksek (Köpüklü şarap gaz kaybı)",
        ingredients: [
            { name: "Tekila Blanco (100% Agave)", amount: "45 ml", unitCost: 46.00 },
            { name: "Cointreau Portakal Likörü", amount: "20 ml", unitCost: 19.80 },
            { name: "Alanya Kan Portakalı Taze Sıkım", amount: "30 ml", unitCost: 9.00 },
            { name: "İtalyan Prosecco (Brut)", amount: "60 ml", unitCost: 18.80 },
            { name: "Yenilebilir Altın Tozu & Garnitür", amount: "1 porsiyon", unitCost: 5.00 }
        ],
        notes: "Şişe açıldıktan sonra hava vakum tıpası ile kapatılmalıdır."
    },
    {
        id: "lusso-spiced-margarita",
        name: "Lusso Spiced Margarita",
        tagline: "Hafif Acı Jalapeño & İsli Agave",
        category: "Klasik & Twist",
        glass: "Margarita / Coupe Glass",
        garnish: "İsot & Tütsülenmiş Deniz Tuzu Kenarlık + Jalapeño Dilimi",
        alcoholVolume: "50 ml",
        totalVolume: "125 ml",
        unitCost: 82.00,
        salesPrice: 450.00,
        dailyOrders: 46,
        wasteRisk: "Düşük",
        ingredients: [
            { name: "Reposado Tekila (Meşe Fıçılı)", amount: "50 ml", unitCost: 54.00 },
            { name: "Organik Agave Nektarı", amount: "25 ml", unitCost: 11.50 },
            { name: "Taze Misket Limonu (Lime) Suyu", amount: "25 ml", unitCost: 7.00 },
            { name: "Taze Jalapeño Biberi", amount: "2 dilim", unitCost: 4.50 },
            { name: "Tütsülü Baharat Kenarlığı & Buz", amount: "1 porsiyon", unitCost: 5.00 }
        ],
        notes: "Müşteri isteğine göre acılık seviyesi ayarlanabilir (Mild / Picante)."
    }
];

const DEFAULT_STOCKS = [
    {
        id: "stk-gin-tanqueray",
        name: "Tanqueray London Dry Gin (70cl)",
        category: "Cin",
        totalVolumeMl: 700,
        currentVolumeMl: 450,
        unitBottlePrice: 850.00,
        criticalThresholdMl: 300,
        bottlesInStock: 4,
        emptyTareGrams: 475,
        unit: "şişe",
        status: "normal"
    },
    {
        id: "stk-vodka-absolut",
        name: "Absolut Blue Vodka (70cl)",
        category: "Votka",
        totalVolumeMl: 700,
        currentVolumeMl: 280,
        unitBottlePrice: 720.00,
        criticalThresholdMl: 350,
        bottlesInStock: 2,
        emptyTareGrams: 460,
        unit: "şişe",
        status: "critical"
    },
    {
        id: "stk-tequila-donjulio",
        name: "Don Julio Blanco Tequila (70cl)",
        category: "Tekila",
        totalVolumeMl: 700,
        currentVolumeMl: 550,
        unitBottlePrice: 1450.00,
        criticalThresholdMl: 250,
        bottlesInStock: 3,
        emptyTareGrams: 620,
        unit: "şişe",
        status: "normal"
    },
    {
        id: "stk-rum-havana",
        name: "Havana Club 3 Años Rum (70cl)",
        category: "Rom",
        totalVolumeMl: 700,
        currentVolumeMl: 190,
        unitBottlePrice: 690.00,
        criticalThresholdMl: 300,
        bottlesInStock: 1,
        emptyTareGrams: 430,
        unit: "şişe",
        status: "critical"
    },
    {
        id: "stk-liq-cointreau",
        name: "Cointreau Portakal Likörü (70cl)",
        category: "Likör",
        totalVolumeMl: 700,
        currentVolumeMl: 400,
        unitBottlePrice: 980.00,
        criticalThresholdMl: 200,
        bottlesInStock: 2,
        emptyTareGrams: 510,
        unit: "şişe",
        status: "normal"
    },
    {
        id: "stk-liq-baileys",
        name: "Baileys Irish Cream (70cl)",
        category: "Likör",
        totalVolumeMl: 700,
        currentVolumeMl: 120,
        unitBottlePrice: 680.00,
        criticalThresholdMl: 250,
        bottlesInStock: 1,
        emptyTareGrams: 540,
        unit: "şişe",
        status: "critical"
    },
    {
        id: "stk-wine-prosecco",
        name: "Martini Prosecco Brut (75cl)",
        category: "Köpüklü Şarap",
        totalVolumeMl: 750,
        currentVolumeMl: 600,
        unitBottlePrice: 520.00,
        criticalThresholdMl: 400,
        bottlesInStock: 5,
        emptyTareGrams: 750,
        unit: "şişe",
        status: "normal"
    },
    {
        id: "stk-liq-kahlua",
        name: "Kahlúa Coffee Liqueur (70cl)",
        category: "Likör",
        totalVolumeMl: 700,
        currentVolumeMl: 480,
        unitBottlePrice: 790.00,
        criticalThresholdMl: 200,
        bottlesInStock: 3,
        emptyTareGrams: 530,
        unit: "şişe",
        status: "normal"
    }
];

const DEFAULT_WASTES = [
    {
        id: "wst-001",
        time: "18:45",
        date: "Bugün",
        item: "Tanqueray London Dry Gin",
        amount: "50 ml",
        reason: "Tezgâh Dökülmesi / Shaker taşması",
        cost: 29.50,
        staff: "Barista Kerem",
        status: "Onaylandı"
    },
    {
        id: "wst-002",
        time: "19:30",
        date: "Bugün",
        item: "Coupe Kadeh Kırılması & Apple Sour Kokteyli",
        amount: "1 Adet Kadeh + 1 Porsiyon",
        reason: "Bulaşıkhane kırığı / Düşme",
        cost: 112.80,
        staff: "Barmen Arda",
        status: "Onaylandı"
    },
    {
        id: "wst-003",
        time: "20:15",
        date: "Bugün",
        item: "Martini Prosecco Şişesi (Hava Kaçırma)",
        amount: "150 ml",
        reason: "Gaz Kaçması / Asit düşüşü",
        cost: 47.00,
        staff: "Barmen Selin",
        status: "İncelendi"
    },
    {
        id: "wst-004",
        time: "21:10",
        date: "Bugün",
        item: "Taze Sıkım Kan Portakalı Suyu",
        amount: "200 ml",
        reason: "Günü geçen taze meyve suyu porsiyonu",
        cost: 38.00,
        staff: "Barista Kerem",
        status: "Onaylandı"
    }
];

window.LUSSO_DATA = {
    DEFAULT_COCKTAILS,
    DEFAULT_STOCKS,
    DEFAULT_WASTES
};

