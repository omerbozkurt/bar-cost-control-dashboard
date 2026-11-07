/**
 * LUSSO BISTRO & BAR - Bar Cost & Stok Yönetim Modülü
 * Ana Uygulama Mantığı (Engine & State Management)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State Initialization
    const STORAGE_KEY_COCKTAILS = 'lusso_bar_cocktails_v1';
    const STORAGE_KEY_STOCKS = 'lusso_bar_stocks_v1';
    const STORAGE_KEY_WASTES = 'lusso_bar_wastes_v1';

    let cocktails = loadState(STORAGE_KEY_COCKTAILS, window.LUSSO_DATA.DEFAULT_COCKTAILS);
    let stocks = loadState(STORAGE_KEY_STOCKS, window.LUSSO_DATA.DEFAULT_STOCKS);
    let wastes = loadState(STORAGE_KEY_WASTES, window.LUSSO_DATA.DEFAULT_WASTES);

    let activeFilter = 'all';
    let searchQuery = '';
    let costChartInstance = null;
    let currentShiftMultiplier = 1.0; // 1.0 = Normal, 0.8 = Happy Hour, 1.15 = Gece Kulübü

    // 2. Helper Functions
    function loadState(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : JSON.parse(JSON.stringify(fallback));
        } catch (e) {
            console.error("Storage error:", e);
            return JSON.parse(JSON.stringify(fallback));
        }
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY_COCKTAILS, JSON.stringify(cocktails));
        localStorage.setItem(STORAGE_KEY_STOCKS, JSON.stringify(stocks));
        localStorage.setItem(STORAGE_KEY_WASTES, JSON.stringify(wastes));
    }

    function formatCurrency(num) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(num);
    }

    function formatNumber(num, decimals = 1) {
        return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num);
    }

    // 3. Live Clock and Date
    function updateLiveClock() {
        const now = new Date();
        const timeEl = document.getElementById('liveTime');
        const dateEl = document.getElementById('liveDate');
        
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
        }
    }
    setInterval(updateLiveClock, 1000);
    updateLiveClock();

    // 4. Toast Notifications
    function showToast(message, type = 'gold') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        if (type === 'emerald') toast.style.borderLeftColor = 'var(--emerald-500)';
        if (type === 'rose') toast.style.borderLeftColor = 'var(--rose-500)';

        let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
        if (type === 'rose') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        }

        toast.innerHTML = `
            <div style="color: ${type === 'rose' ? 'var(--rose-400)' : type === 'emerald' ? 'var(--emerald-400)' : 'var(--gold-400)'};">${iconSvg}</div>
            <div style="flex: 1; font-weight: 500;">${message}</div>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // 5. Update KPI Cards & Metrics
    function updateKPIs() {
        // Calculate weighted F&B Cost
        let totalDailyRevenue = 0;
        let totalDailyCost = 0;
        let totalOrders = 0;

        cocktails.forEach(c => {
            const orders = c.dailyOrders || 45;
            totalOrders += orders;
            totalDailyRevenue += c.salesPrice * orders;
            totalDailyCost += c.unitCost * orders;
        });

        const overallCostPct = totalDailyRevenue > 0 ? (totalDailyCost / totalDailyRevenue) * 100 : 23.4;
        const totalWasteCost = wastes.reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
        const wastePct = totalDailyRevenue > 0 ? (totalWasteCost / totalDailyRevenue) * 100 : 1.2;

        // KPI Elements
        const kpiCostEl = document.getElementById('kpiTargetCost');
        const kpiCostBadge = document.getElementById('kpiCostBadge');
        const kpiWasteEl = document.getElementById('kpiWasteRate');
        const kpiCocktailCountEl = document.getElementById('kpiCocktailCount');
        const kpiRevenueEl = document.getElementById('kpiDailyRevenue');
        const kpiProfitMarginEl = document.getElementById('kpiAvgMargin');
        const kpiWasteCostSumEl = document.getElementById('kpiWasteCostSum');

        if (kpiCostEl) kpiCostEl.textContent = `%${formatNumber(overallCostPct, 1)}`;
        if (kpiCostBadge) {
            if (overallCostPct <= 20) {
                kpiCostBadge.className = 'kpi-badge badge-success';
                kpiCostBadge.textContent = 'Mükemmel (%20 Altı)';
            } else if (overallCostPct <= 25) {
                kpiCostBadge.className = 'kpi-badge badge-gold';
                kpiCostBadge.textContent = 'İdeal Aralık (%20-%25)';
            } else {
                kpiCostBadge.className = 'kpi-badge badge-warning';
                kpiCostBadge.textContent = 'Maliyet Yüksek';
            }
        }

        if (kpiWasteEl) kpiWasteEl.textContent = `%${formatNumber(wastePct, 1)}`;
        if (kpiWasteCostSumEl) kpiWasteCostSumEl.textContent = formatCurrency(totalWasteCost);
        if (kpiCocktailCountEl) kpiCocktailCountEl.textContent = cocktails.length;
        if (kpiRevenueEl) kpiRevenueEl.textContent = formatCurrency(totalDailyRevenue);
        
        const avgMargin = totalDailyRevenue > 0 ? ((totalDailyRevenue - totalDailyCost) / totalDailyRevenue) * 100 : 76.6;
        if (kpiProfitMarginEl) kpiProfitMarginEl.textContent = `%${formatNumber(avgMargin, 1)}`;

        // Update Simulator Defaults
        updateSimulator();
    }

    // 6. Render Cocktails Table
    function renderCocktailsTable() {
        const tbody = document.getElementById('cocktailsTableBody');
        if (!tbody) return;

        // Filter and Search
        let filtered = cocktails.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (c.tagline && c.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                  c.category.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (!matchesSearch) return false;

            const marginPct = ((c.salesPrice - c.unitCost) / c.salesPrice) * 100;
            const costPct = (c.unitCost / c.salesPrice) * 100;

            if (activeFilter === 'high-margin') return marginPct >= 82;
            if (activeFilter === 'low-cost') return costPct <= 18;
            if (activeFilter === 'signatures') return c.category === 'İmza Kokteyller';
            return true;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        Aramanızla eşleşen kokteyl veya reçete bulunamadı.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map((c, idx) => {
            const profit = c.salesPrice - c.unitCost;
            const marginPct = (profit / c.salesPrice) * 100;
            const costPct = (c.unitCost / c.salesPrice) * 100;
            const marginClass = marginPct >= 82 ? 'margin-high' : 'margin-mid';

            return `
                <tr data-id="${c.id}">
                    <td>
                        <div class="cocktail-meta-cell">
                            <div class="cocktail-avatar">${idx + 1}</div>
                            <div class="cocktail-title-group">
                                <span class="cocktail-name">${c.name}</span>
                                <span class="cocktail-tagline">${c.tagline || c.category}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <span class="specs-chip">${c.alcoholVolume} Alkol Bazı</span>
                            <span style="font-size: 0.72rem; color: var(--text-muted);">${c.glass}</span>
                        </div>
                    </td>
                    <td>
                        <div class="price-tag cost-val">
                            ${formatCurrency(c.unitCost)}
                        </div>
                        <span class="cost-pct-badge">%${formatNumber(costPct, 1)} Maliyet</span>
                    </td>
                    <td>
                        <div class="editable-price-wrap" title="Fiyatı değiştirmek için üzerine tıklayın">
                            <span style="font-size: 0.8rem; color: var(--gold-400);">₺</span>
                            <input type="number" 
                                   class="price-input-inline" 
                                   value="${c.salesPrice}" 
                                   min="50" 
                                   step="10" 
                                   data-id="${c.id}" />
                        </div>
                    </td>
                    <td>
                        <div class="price-tag profit-val">
                            +${formatCurrency(profit)}
                        </div>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">kadeh başına</span>
                    </td>
                    <td>
                        <span class="margin-pill ${marginClass}">
                            %${formatNumber(marginPct, 1)}
                        </span>
                    </td>
                    <td>
                        <div class="table-action-btns">
                            <button class="btn-table-action" onclick="window.viewRecipeDetails('${c.id}')" title="Reçete & Malzeme Standartları">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                Detay
                            </button>
                            <button class="btn-table-action" onclick="window.quickLogCocktailWaste('${c.id}')" title="Zayiat Olarak İşle" style="color: var(--rose-400);">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                                Zayiat
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach Inline Edit Listeners
        document.querySelectorAll('.price-input-inline').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const newPrice = parseFloat(e.target.value);
                if (isNaN(newPrice) || newPrice <= 0) {
                    showToast('Geçersiz satış fiyatı girdiniz!', 'rose');
                    renderCocktailsTable();
                    return;
                }
                const cocktail = cocktails.find(x => x.id === id);
                if (cocktail) {
                    cocktail.salesPrice = newPrice;
                    saveState();
                    renderCocktailsTable();
                    updateKPIs();
                    renderCharts();
                    showToast(`${cocktail.name} satış fiyatı ${formatCurrency(newPrice)} olarak güncellendi.`, 'emerald');
                }
            });
        });
    }

    // 7. Render Stock Inventory Cards
    function renderStockCards() {
        const grid = document.getElementById('stockStatusGrid');
        if (!grid) return;

        grid.innerHTML = stocks.map(stk => {
            const fillPct = Math.min(100, Math.round((stk.currentVolumeMl / stk.totalVolumeMl) * 100));
            const isCritical = stk.currentVolumeMl <= stk.criticalThresholdMl || stk.bottlesInStock <= 1;
            const levelClass = fillPct < 30 ? 'level-danger' : fillPct < 55 ? 'level-warn' : 'level-good';

            return `
                <div class="stock-item-card ${isCritical ? 'is-critical' : ''}">
                    <div class="stock-item-header">
                        <div>
                            <div class="stock-item-name">${stk.name}</div>
                            <div class="stock-item-cat">${stk.category} • Şişe: ${formatCurrency(stk.unitBottlePrice)}</div>
                        </div>
                        ${isCritical ? '<span class="kpi-badge badge-warning">Kritik Stok</span>' : '<span class="kpi-badge badge-success">Yeterli</span>'}
                    </div>

                    <div class="stock-metrics">
                        <span style="color: var(--text-muted);">Aktif Şişe Doluluk:</span>
                        <span style="font-weight: 700; color: #FFF;">${stk.currentVolumeMl} / ${stk.totalVolumeMl} ml (%${fillPct})</span>
                    </div>

                    <div class="stock-level-bar">
                        <div class="stock-level-fill ${levelClass}" style="width: ${fillPct}%"></div>
                    </div>

                    <div class="stock-card-footer">
                        <span style="font-size: 0.74rem; color: var(--text-secondary);">
                            Yedek Depo: <strong style="color: #FFF;">${stk.bottlesInStock} şişe</strong>
                        </span>
                        <button class="quick-stock-btn" onclick="window.restockBottle('${stk.id}')">
                            +1 Şişe Aç
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Populate stock select in Waste Form
        const wasteSelect = document.getElementById('wasteItemSelect');
        if (wasteSelect) {
            wasteSelect.innerHTML = `
                <optgroup label="Bar Şişeleri & Likörler">
                    ${stocks.map(s => `<option value="stock:${s.id}">${s.name} (${s.category})</option>`).join('')}
                </optgroup>
                <optgroup label="Hazır Kokteyller (Kırılan / İade)">
                    ${cocktails.map(c => `<option value="cocktail:${c.id}">${c.name}</option>`).join('')}
                </optgroup>
            `;
        }
    }

    // 8. Render Waste Logs List
    function renderWasteList() {
        const listContainer = document.getElementById('wasteLogList');
        if (!listContainer) return;

        if (wastes.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 25px; color: var(--text-muted); font-size: 0.82rem;">
                    Bugün henüz zayiat kaydı girilmedi. Bar operasyonu sorunsuz ilerliyor.
                </div>
            `;
            return;
        }

        listContainer.innerHTML = wastes.map((w, index) => `
            <div class="waste-log-item">
                <div class="waste-log-left">
                    <div class="waste-log-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div>
                        <div class="waste-item-title">${w.item}</div>
                        <div class="waste-item-meta">
                            ${w.reason} • <span style="color: var(--text-primary); font-weight: 500;">${w.amount}</span> • ${w.staff || 'Bar Ekibi'}
                        </div>
                    </div>
                </div>
                <div class="waste-cost-badge">
                    <div class="waste-cost-val">-${formatCurrency(w.cost)}</div>
                    <div class="waste-time-badge">${w.time} | <span style="color: var(--gold-400); cursor: pointer;" onclick="window.removeWasteEntry(${index})">Sil</span></div>
                </div>
            </div>
        `).join('');
    }

    // 9. Interactive Global Handlers
    window.restockBottle = (id) => {
        const item = stocks.find(s => s.id === id);
        if (item) {
            if (item.bottlesInStock > 0) {
                item.bottlesInStock -= 1;
                item.currentVolumeMl = item.totalVolumeMl;
                saveState();
                renderStockCards();
                showToast(`${item.name} için yeni şişe bar tezgahına alındı.`, 'emerald');
            } else {
                showToast(`Yedek depoda ${item.name} kalmadı! Sipariş verilmeli.`, 'rose');
            }
        }
    };

    window.removeWasteEntry = (index) => {
        if (confirm("Bu zayiat kaydını silmek istediğinize emin misiniz?")) {
            wastes.splice(index, 1);
            saveState();
            renderWasteList();
            updateKPIs();
            showToast("Zayiat kaydı silindi.", "gold");
        }
    };

    window.quickLogCocktailWaste = (id) => {
        const c = cocktails.find(x => x.id === id);
        if (!c) return;

        const reason = prompt(`${c.name} için zayiat sebebi nedir? (örn: Döküldü, Bardak Kırıldı, Müşteri İadesi)`, "Döküldü / Bulaşıkhane Kırığı");
        if (reason) {
            const now = new Date();
            const newWaste = {
                id: `wst-${Date.now()}`,
                time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                date: "Bugün",
                item: `${c.name} Kokteyli`,
                amount: "1 Porsiyon Kadeh",
                reason: reason,
                cost: c.unitCost,
                staff: "Vardiya Barmeni",
                status: "İşlendi"
            };
            wastes.unshift(newWaste);
            saveState();
            renderWasteList();
            updateKPIs();
            showToast(`${c.name} zayiatı kaydedildi (${formatCurrency(c.unitCost)}).`, 'rose');
        }
    };

    window.viewRecipeDetails = (id) => {
        const c = cocktails.find(x => x.id === id);
        if (!c) return;

        const modal = document.getElementById('recipeModal');
        const modalTitle = document.getElementById('recipeModalTitle');
        const modalBody = document.getElementById('recipeModalBody');

        if (!modal || !modalBody) return;

        modalTitle.textContent = `${c.name} — Reçete & Standart`;

        const profit = c.salesPrice - c.unitCost;
        const marginPct = (profit / c.salesPrice) * 100;
        const costPct = (c.unitCost / c.salesPrice) * 100;

        modalBody.innerHTML = `
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; background: #161A24; padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-gold);">
                <div>
                    <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Kategori</span>
                    <h4 style="color: var(--gold-400); font-size: 1rem; margin-top: 2px;">${c.category}</h4>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Kadeh & Garnitür</span>
                    <div style="font-size: 0.85rem; color: #FFF; margin-top: 2px;">${c.glass} • ${c.garnish}</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
                <div style="background: var(--bg-elevated); padding: 12px; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--border-subtle);">
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Birim Maliyet</div>
                    <div style="font-size: 1.15rem; font-weight: 700; color: #F87171; margin-top: 2px;">${formatCurrency(c.unitCost)}</div>
                </div>
                <div style="background: var(--bg-elevated); padding: 12px; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--border-subtle);">
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Satış Fiyatı</div>
                    <div style="font-size: 1.15rem; font-weight: 700; color: #FFF; margin-top: 2px;">${formatCurrency(c.salesPrice)}</div>
                </div>
                <div style="background: var(--bg-elevated); padding: 12px; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--border-subtle);">
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Net Kâr Marjı</div>
                    <div style="font-size: 1.15rem; font-weight: 700; color: var(--emerald-400); margin-top: 2px;">%${formatNumber(marginPct, 1)}</div>
                </div>
            </div>

            <h4 style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
                Standart Malzeme & Maliyet Dökümü (Pour Cost)
            </h4>

            <div class="ingredient-list-box">
                ${c.ingredients ? c.ingredients.map(ing => `
                    <div class="ingredient-row">
                        <div>
                            <strong style="color: #FFF;">${ing.name}</strong>
                            <span style="color: var(--text-muted); font-size: 0.76rem; margin-left: 6px;">(${ing.amount})</span>
                        </div>
                        <span style="font-weight: 600; color: var(--gold-400);">${formatCurrency(ing.unitCost)}</span>
                    </div>
                `).join('') : '<p style="color: var(--text-muted);">Detaylı malzeme listesi girilmemiş.</p>'}
            </div>

            ${c.notes ? `
                <div style="margin-top: 18px; padding: 12px; background: rgba(212, 175, 55, 0.06); border-radius: var(--radius-sm); border-left: 3px solid var(--gold-500); font-size: 0.8rem; color: var(--text-secondary);">
                    <strong style="color: var(--gold-400);">Barmen Hazırlama Notu:</strong> ${c.notes}
                </div>
            ` : ''}
        `;

        modal.classList.add('active');
    };

    window.closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    };

    // 10. Waste Form Submission
    const wasteForm = document.getElementById('quickWasteForm');
    if (wasteForm) {
        wasteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectVal = document.getElementById('wasteItemSelect').value;
            const amountVal = document.getElementById('wasteAmountInput').value.trim();
            const reasonVal = document.getElementById('wasteReasonSelect').value;

            if (!amountVal) {
                showToast("Lütfen dökülen veya kırılan miktarı belirtin.", "rose");
                return;
            }

            let itemName = "Bilinmeyen Ürün";
            let estCost = 45.00;

            const [type, id] = selectVal.split(':');
            if (type === 'stock') {
                const stockItem = stocks.find(s => s.id === id);
                if (stockItem) {
                    itemName = stockItem.name;
                    // Check if user specified ml or bottle
                    if (amountVal.includes('şişe') || amountVal.includes('adet')) {
                        estCost = stockItem.unitBottlePrice;
                        if (stockItem.bottlesInStock > 0) stockItem.bottlesInStock -= 1;
                    } else {
                        const parsedMl = parseFloat(amountVal) || 50;
                        estCost = (stockItem.unitBottlePrice / stockItem.totalVolumeMl) * parsedMl;
                        stockItem.currentVolumeMl = Math.max(0, stockItem.currentVolumeMl - parsedMl);
                    }
                }
            } else if (type === 'cocktail') {
                const c = cocktails.find(x => x.id === id);
                if (c) {
                    itemName = `${c.name} Kokteyli`;
                    estCost = c.unitCost;
                }
            }

            const now = new Date();
            const newRecord = {
                id: `wst-${Date.now()}`,
                time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                date: "Bugün",
                item: itemName,
                amount: amountVal,
                reason: reasonVal,
                cost: parseFloat(estCost.toFixed(2)),
                staff: "Servis Barmeni",
                status: "Kaydedildi"
            };

            wastes.unshift(newRecord);
            saveState();
            renderWasteList();
            renderStockCards();
            updateKPIs();
            wasteForm.reset();
            showToast(`Zayiat kaydı başarıyla eklendi (${formatCurrency(estCost)} maliyet yansıtıldı).`, 'emerald');
        });
    }

    // 11. Add New Cocktail Modal & Dynamic Ingredients
    const btnOpenAddModal = document.getElementById('btnOpenAddModal');
    if (btnOpenAddModal) {
        btnOpenAddModal.addEventListener('click', () => {
            const modal = document.getElementById('addCocktailModal');
            if (modal) modal.classList.add('active');
        });
    }

    const addIngredientRowBtn = document.getElementById('btnAddIngredientRow');
    const dynamicIngredientsList = document.getElementById('dynamicIngredientsList');

    if (addIngredientRowBtn && dynamicIngredientsList) {
        addIngredientRowBtn.addEventListener('click', () => {
            const row = document.createElement('div');
            row.className = 'dynamic-ingredient-row';
            row.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 8px; margin-bottom: 8px; align-items: center;';
            row.innerHTML = `
                <input type="text" class="form-control ing-name" placeholder="Malzeme (örn. Bacardi Beyaz Rom)" required />
                <input type="text" class="form-control ing-amt" placeholder="50 ml" required />
                <input type="number" step="0.5" class="form-control ing-cost" placeholder="Maliyet ₺" required />
                <button type="button" class="btn btn-secondary btn-icon-only" style="color: var(--rose-400);" onclick="this.parentElement.remove()">✕</button>
            `;
            dynamicIngredientsList.appendChild(row);
        });
    }

    const newCocktailForm = document.getElementById('newCocktailForm');
    if (newCocktailForm) {
        newCocktailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('newCocktailName').value.trim();
            const category = document.getElementById('newCocktailCategory').value;
            const glass = document.getElementById('newCocktailGlass').value.trim() || 'Coupe Glass';
            const garnish = document.getElementById('newCocktailGarnish').value.trim() || 'Limon & Nane';
            const salesPrice = parseFloat(document.getElementById('newCocktailSalesPrice').value);

            // Compute total cost from ingredient rows
            const rows = dynamicIngredientsList.querySelectorAll('.dynamic-ingredient-row');
            let totalUnitCost = 0;
            const ingredients = [];

            rows.forEach(r => {
                const ingName = r.querySelector('.ing-name').value;
                const ingAmt = r.querySelector('.ing-amt').value;
                const ingCost = parseFloat(r.querySelector('.ing-cost').value) || 0;
                totalUnitCost += ingCost;
                ingredients.push({ name: ingName, amount: ingAmt, unitCost: ingCost });
            });

            if (ingredients.length === 0) {
                totalUnitCost = parseFloat(document.getElementById('newCocktailManualCost').value) || (salesPrice * 0.22);
            }

            const newCocktail = {
                id: `ck-${Date.now()}`,
                name: name,
                tagline: "Yeni Menü Seçeneği",
                category: category,
                glass: glass,
                garnish: garnish,
                alcoholVolume: "50 ml",
                totalVolume: "150 ml",
                unitCost: parseFloat(totalUnitCost.toFixed(2)),
                salesPrice: salesPrice,
                dailyOrders: 35,
                wasteRisk: "Düşük",
                ingredients: ingredients.length > 0 ? ingredients : [
                    { name: "Alkol Bazı & Mikser Karışımı", amount: "1 porsiyon", unitCost: totalUnitCost }
                ]
            };

            cocktails.push(newCocktail);
            saveState();
            renderCocktailsTable();
            updateKPIs();
            renderCharts();
            closeModal('addCocktailModal');
            newCocktailForm.reset();
            showToast(`${newCocktail.name} kokteyli menüye ve maliyet tablosuna eklendi!`, 'emerald');
        });
    }

    // 12. Search & Filter Handlers
    const searchInput = document.getElementById('cocktailSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderCocktailsTable();
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            renderCocktailsTable();
        });
    });

    // 13. Simulator Controls
    function updateSimulator() {
        const priceSlider = document.getElementById('simPriceSlider');
        const costSlider = document.getElementById('simCostSlider');
        const priceLabel = document.getElementById('simPriceLabel');
        const costLabel = document.getElementById('simCostLabel');
        const simResultCost = document.getElementById('simResultCost');
        const simResultProfit = document.getElementById('simResultProfit');

        if (!priceSlider || !costSlider) return;

        const priceAdjPct = parseFloat(priceSlider.value) || 0;
        const costAdjPct = parseFloat(costSlider.value) || 0;

        if (priceLabel) priceLabel.textContent = `${priceAdjPct >= 0 ? '+' : ''}${priceAdjPct}%`;
        if (costLabel) costLabel.textContent = `${costAdjPct >= 0 ? '+' : ''}${costAdjPct}%`;

        let simRevenue = 0;
        let simCost = 0;

        cocktails.forEach(c => {
            const orders = c.dailyOrders || 45;
            const adjustedPrice = c.salesPrice * (1 + priceAdjPct / 100);
            const adjustedCost = c.unitCost * (1 + costAdjPct / 100);
            simRevenue += adjustedPrice * orders;
            simCost += adjustedCost * orders;
        });

        const simCostPct = simRevenue > 0 ? (simCost / simRevenue) * 100 : 23.4;
        const simProfit = simRevenue - simCost;

        if (simResultCost) simResultCost.textContent = `%${formatNumber(simCostPct, 1)}`;
        if (simResultProfit) simResultProfit.textContent = formatCurrency(simProfit);
    }

    const simPriceSlider = document.getElementById('simPriceSlider');
    const simCostSlider = document.getElementById('simCostSlider');
    if (simPriceSlider) simPriceSlider.addEventListener('input', updateSimulator);
    if (simCostSlider) simCostSlider.addEventListener('input', updateSimulator);

    // 14. Chart.js Render
    function renderCharts() {
        const ctx = document.getElementById('cocktailCostChart');
        if (!ctx) return;

        const labels = cocktails.map(c => c.name.split(' ').slice(0, 2).join(' '));
        const costs = cocktails.map(c => c.unitCost);
        const prices = cocktails.map(c => c.salesPrice);

        if (costChartInstance) {
            costChartInstance.destroy();
        }

        costChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Birim Maliyet (₺)',
                        data: costs,
                        backgroundColor: 'rgba(239, 68, 68, 0.75)',
                        borderColor: '#EF4444',
                        borderWidth: 1,
                        borderRadius: 4
                    },
                    {
                        label: 'Satış Fiyatı (₺)',
                        data: prices,
                        backgroundColor: 'rgba(212, 175, 55, 0.85)',
                        borderColor: '#F5E5A4',
                        borderWidth: 1,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#9CA3AF',
                            font: { family: 'Plus Jakarta Sans', size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#11141B',
                        titleColor: '#F5E5A4',
                        bodyColor: '#FFF',
                        borderColor: 'rgba(212, 175, 55, 0.3)',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#9CA3AF', font: { family: 'Plus Jakarta Sans', size: 11 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#9CA3AF',
                            callback: function(val) { return `₺${val}`; }
                        }
                    }
                }
            }
        });
    }

    // 15. Export CSV & Print Handlers
    const btnExportCSV = document.getElementById('btnExportCSV');
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            let csv = "Kokteyl Adi;Kategori;Kadeh;Birim Maliyet (TL);Satis Fiyati (TL);Net Kar (TL);Kar Marji (%);Cost Yuzdesi (%)\n";
            cocktails.forEach(c => {
                const profit = c.salesPrice - c.unitCost;
                const marginPct = ((profit / c.salesPrice) * 100).toFixed(1);
                const costPct = ((c.unitCost / c.salesPrice) * 100).toFixed(1);
                csv += `"${c.name}";"${c.category}";"${c.glass}";${c.unitCost.toFixed(2)};${c.salesPrice.toFixed(2)};${profit.toFixed(2)};${marginPct};${costPct}\n`;
            });

            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Lusso_Bar_Cost_Raporu_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Maliyet tablosu CSV dosyası olarak dışa aktarıldı.", "emerald");
        });
    }

    const btnPrintReport = document.getElementById('btnPrintReport');
    if (btnPrintReport) {
        btnPrintReport.addEventListener('click', () => {
            window.print();
        });
    }

    const btnResetData = document.getElementById('btnResetData');
    if (btnResetData) {
        btnResetData.addEventListener('click', () => {
            if (confirm("Tüm verileri Lusso Bistro & Bar fabrika başlangıç ayarlarına sıfırlamak istiyor musunuz?")) {
                localStorage.removeItem(STORAGE_KEY_COCKTAILS);
                localStorage.removeItem(STORAGE_KEY_STOCKS);
                localStorage.removeItem(STORAGE_KEY_WASTES);
                cocktails = JSON.parse(JSON.stringify(window.LUSSO_DATA.DEFAULT_COCKTAILS));
                stocks = JSON.parse(JSON.stringify(window.LUSSO_DATA.DEFAULT_STOCKS));
                wastes = JSON.parse(JSON.stringify(window.LUSSO_DATA.DEFAULT_WASTES));
                renderCocktailsTable();
                renderStockCards();
                renderWasteList();
                updateKPIs();
                renderCharts();
                showToast("Tüm veriler varsayılan Lusso menüsüne sıfırlandı.", "gold");
            }
        });
    }

    // 16. TAB NAVIGATION (Sadeleştirilmiş Görünüm ve Kolay Gezinme)
    function switchTab(targetTabId) {
        // Update nav buttons
        document.querySelectorAll('.tab-nav-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === targetTabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update content panels
        document.querySelectorAll('.tab-content-panel').forEach(panel => {
            if (panel.id === targetTabId) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // If switching to analytics, re-render chart to adapt to container width
        if (targetTabId === 'tab-analytics') {
            setTimeout(renderCharts, 50);
        }
    }

    // Attach click listener to tab navigation buttons
    document.querySelectorAll('.tab-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            if (target) switchTab(target);
        });
    });

    // Header Quick Button for Guide
    const btnOpenGuideTab = document.getElementById('btnOpenGuideTab');
    if (btnOpenGuideTab) {
        btnOpenGuideTab.addEventListener('click', () => {
            switchTab('tab-academy');
            const academyEl = document.getElementById('tab-academy');
            if (academyEl) {
                academyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // 17. İNTERAKTİF ÖĞRETİCİ ALAN (ACADEMY REHBER DEMO FONKSİYONLARI)
    window.runGuidedDemo = () => {
        showToast("🎓 1. Adım: Menü reçetelerini ve pour cost'u inceleyin.", "gold");
        switchTab('tab-cocktails');
        setTimeout(() => {
            window.viewRecipeDetails('lusso-velvet-espresso');
        }, 400);
    };

    window.demoPriceChange = () => {
        switchTab('tab-cocktails');
        const margarita = cocktails.find(c => c.id === 'lusso-spiced-margarita');
        if (margarita) {
            const oldPrice = margarita.salesPrice;
            const newPrice = oldPrice >= 480 ? 450 : oldPrice + 30;
            margarita.salesPrice = newPrice;
            saveState();
            renderCocktailsTable();
            updateKPIs();
            renderCharts();
            showToast(`💡 Örnek Fiyat Değişimi: Spiced Margarita ${formatCurrency(newPrice)} yapıldı. Kâr marjı anında güncellendi!`, "emerald");
        }
    };

    window.demoLogWaste = () => {
        switchTab('tab-stock-waste');
        const now = new Date();
        const testWaste = {
            id: `wst-demo-${Date.now()}`,
            time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            date: "Bugün",
            item: "Tanqueray London Dry Gin (50 ml)",
            amount: "50 ml Dökülme",
            reason: "Tezgâh Dökülmesi / Shaker taşması",
            cost: 29.50,
            staff: "Eğitim Barmeni",
            status: "Otomatik Eklendi"
        };
        wastes.unshift(testWaste);
        saveState();
        renderWasteList();
        updateKPIs();
        showToast("📦 Örnek Zayiat Kaydı Eklendi: 29,50 ₺ maliyet zayiat tablosuna ve KPI'a yansıdı.", "rose");
    };

    window.demoStockAlert = () => {
        switchTab('tab-stock-waste');
        const absolut = stocks.find(s => s.id === 'stk-vodka-absolut');
        if (absolut) {
            window.restockBottle('stk-vodka-absolut');
            showToast("✨ Absolut Votka için yedek depodan 1 şişe açıldı ve tezgâh doluluğu %100 yapıldı!", "emerald");
        }
    };

    // Initial Renders
    renderCocktailsTable();
    renderStockCards();
    renderWasteList();
    updateKPIs();
    renderCharts();
});

