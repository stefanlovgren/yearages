document.addEventListener('DOMContentLoaded', () => {
    // State
    let familyMembers = [];
    let currentStartYear = 2007;
    let currentEndYear = 2030;
    let currentSortOrder = 'oldest';
    let editingMemberId = null;

    // DOM Elements
    const form = document.getElementById('add-member-form');
    const exportBtn = document.getElementById('export-btn');
    const importFile = document.getElementById('import-file');
    const resetBtn = document.getElementById('reset-btn');
    const sortOrderSelect = document.getElementById('sort-order');
    const tableHeaderRow = document.getElementById('table-header-row');
    const tableBody = document.getElementById('table-body');
    const startYearInput = document.getElementById('start-year');
    const endYearInput = document.getElementById('end-year');
    const startPresetSelect = document.getElementById('start-preset');
    const endPresetSelect = document.getElementById('end-preset');
    const shiftBackBtn = document.getElementById('shift-back-btn');
    const shiftForwardBtn = document.getElementById('shift-forward-btn');
    const formSubmitBtn = form.querySelector('button[type="submit"]');

    // Modal Elements
    const modal = document.getElementById('member-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalTitle = document.getElementById('modal-title');

    // Modal Logic
    function openModal(isEdit = false) {
        modal.classList.add('show');
        if (!isEdit) {
            form.reset();
            editingMemberId = null;
            modalTitle.textContent = 'Add Family Member';
            formSubmitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Member';
        }
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    if (openModalBtn) openModalBtn.addEventListener('click', () => openModal(false));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    // Close modal if clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Help Modal Elements
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeHelpBtn = document.getElementById('close-help-btn');

    // Close Add/Edit modal if clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
        if (e.target === helpModal) {
            helpModal.classList.remove('show');
        }
    });

    if (helpBtn && helpModal && closeHelpBtn) {
        helpBtn.addEventListener('click', () => {
            helpModal.classList.add('show');
        });
        
        closeHelpBtn.addEventListener('click', () => {
            helpModal.classList.remove('show');
        });
    }

    // Load data from LocalStorage
    function loadData() {
        const storedMembers = localStorage.getItem('familyMembers');
        const storedStart = localStorage.getItem('startYear');
        const storedEnd = localStorage.getItem('endYear');
        const storedSort = localStorage.getItem('sortOrder');

        if (storedMembers) {
            familyMembers = JSON.parse(storedMembers);
        } else {
            // Default demo data based on spreadsheet
            familyMembers = [
                { id: generateId(), name: 'Karin', birthYear: 1931, deathYear: 2021 },
                { id: generateId(), name: 'Sven', birthYear: 1925, deathYear: 2021 },
                { id: generateId(), name: 'Farfar', birthYear: 1900, deathYear: 1976 },
                { id: generateId(), name: 'Morfar', birthYear: 1908, deathYear: 1976 },
                { id: generateId(), name: 'Mormor', birthYear: 1909, deathYear: null },
                { id: generateId(), name: 'Pappa', birthYear: 1927, deathYear: 2017 },
                { id: generateId(), name: 'Mamma', birthYear: 1934, deathYear: null },
                { id: generateId(), name: 'Per-Arne', birthYear: 1959, deathYear: null },
                { id: generateId(), name: 'Stefan', birthYear: 1964, deathYear: null },
                { id: generateId(), name: 'Sommai', birthYear: 1977, deathYear: null },
                { id: generateId(), name: 'Anna', birthYear: 1956, deathYear: null },
                { id: generateId(), name: 'Miranda', birthYear: 1994, deathYear: null },
                { id: generateId(), name: 'Oliver / Gabriel', birthYear: 1998, deathYear: null }
            ];
            saveData();
        }

        if (storedStart) currentStartYear = parseInt(storedStart, 10);
        if (storedEnd) currentEndYear = parseInt(storedEnd, 10);
        if (storedSort) currentSortOrder = storedSort;

        startYearInput.value = currentStartYear;
        endYearInput.value = currentEndYear;
        
        if (sortOrderSelect) {
            sortOrderSelect.value = currentSortOrder;
        }
    }

    // Save data to LocalStorage
    function saveData() {
        localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
        localStorage.setItem('startYear', currentStartYear);
        localStorage.setItem('endYear', currentEndYear);
        localStorage.setItem('sortOrder', currentSortOrder);
    }

    // Generate unique ID
    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Render Table
    function renderGrid() {
        updateCenterDropdown();

        // Render Header
        tableHeaderRow.innerHTML = '<th>Name</th>';
        for (let year = currentStartYear; year <= currentEndYear; year++) {
            const th = document.createElement('th');
            th.textContent = year;
            tableHeaderRow.appendChild(th);
        }

        // Sort members
        const sortedMembers = [...familyMembers].sort((a, b) => {
            if (currentSortOrder === 'youngest') {
                return b.birthYear - a.birthYear;
            } else if (currentSortOrder === 'az') {
                return a.name.localeCompare(b.name);
            } else if (currentSortOrder === 'za') {
                return b.name.localeCompare(a.name);
            }
            // default oldest
            return a.birthYear - b.birthYear;
        });

        // Render Body
        tableBody.innerHTML = '';
        sortedMembers.forEach(member => {
            const tr = document.createElement('tr');
            
            let age = 0;
            if (member.deathAge !== undefined && member.deathAge !== null) {
                age = member.deathAge;
            } else if (member.birthYear && member.deathYear) {
                age = member.deathYear - member.birthYear;
                if (member.deathMonth && member.birthMonth) {
                    if (member.deathMonth < member.birthMonth || 
                       (member.deathMonth === member.birthMonth && member.deathDay && member.birthDay && member.deathDay < member.birthDay)) {
                        age--;
                    }
                }
            } else if (member.birthYear && !member.deathYear) {
                const d = new Date();
                age = d.getFullYear() - member.birthYear;
                if (member.birthMonth) {
                    const currMonth = d.getMonth() + 1;
                    const currDay = d.getDate();
                    if (currMonth < member.birthMonth || 
                       (currMonth === member.birthMonth && member.birthDay && currDay < member.birthDay)) {
                        age--;
                    }
                }
            } else {
                const currentYear = new Date().getFullYear();
                age = currentYear - member.birthYear;
            }
            const lifespan = member.deathYear ? `${member.birthYear} - ${member.deathYear}` : `${member.birthYear} - Present`;
            
            // Name cell with actions
            const nameTd = document.createElement('td');
            nameTd.innerHTML = `
                <div class="name-container">
                    <span class="member-name-text">${member.name}</span>
                    <span class="member-lifespan">${lifespan} • Age ${age}</span>
                </div>
                <div class="row-actions">
                    <button class="icon-btn edit" data-id="${member.id}" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="icon-btn delete" data-id="${member.id}" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            tr.appendChild(nameTd);

            // Age cells
            for (let year = currentStartYear; year <= currentEndYear; year++) {
                const td = document.createElement('td');
                td.className = 'age-cell';
                
                if (year >= member.birthYear && (!member.deathYear || year <= member.deathYear)) {
                    const age = year - member.birthYear;
                    td.textContent = age;
                    
                    // Optional styling based on age ranges
                    if (age < 13) {
                        td.style.backgroundColor = 'var(--age-child)';
                    } else if (age < 20) {
                        td.style.backgroundColor = 'var(--age-teen)';
                    } else if (age < 65) {
                        td.style.backgroundColor = 'var(--age-adult)';
                    } else {
                        td.style.backgroundColor = 'var(--age-senior)';
                    }
                } else {
                    td.classList.add('empty');
                }
                
                tr.appendChild(td);
            }
            
            tableBody.appendChild(tr);
        });

        // Add event listeners to delete and edit buttons
        document.querySelectorAll('.icon-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteMember(id);
            });
        });

        document.querySelectorAll('.icon-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                editMember(id);
            });
        });
    }

    // Edit Member Function
    function editMember(id) {
        const member = familyMembers.find(m => m.id === id);
        if (!member) return;

        document.getElementById('member-name').value = member.name;
        document.getElementById('member-birth').value = member.birthYear;
        document.getElementById('member-birth-month').value = member.birthMonth || '';
        document.getElementById('member-birth-day').value = member.birthDay || '';
        
        document.getElementById('member-death').value = member.deathYear || '';
        document.getElementById('member-death-month').value = member.deathMonth || '';
        document.getElementById('member-death-day').value = member.deathDay || '';
        
        document.getElementById('member-death-age').value = member.deathAge || '';

        editingMemberId = id;
        modalTitle.textContent = 'Edit Family Member';
        formSubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Update Member';
        openModal(true);
    }

    // Add or Update Member
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('member-name').value;
        const birthYear = parseInt(document.getElementById('member-birth').value, 10);
        const birthMonthVal = document.getElementById('member-birth-month').value;
        const birthMonth = birthMonthVal ? parseInt(birthMonthVal, 10) : null;
        const birthDayVal = document.getElementById('member-birth-day').value;
        const birthDay = birthDayVal ? parseInt(birthDayVal, 10) : null;
        
        const deathYearVal = document.getElementById('member-death').value;
        const deathYear = deathYearVal ? parseInt(deathYearVal, 10) : null;
        const deathMonthVal = document.getElementById('member-death-month').value;
        const deathMonth = deathMonthVal ? parseInt(deathMonthVal, 10) : null;
        const deathDayVal = document.getElementById('member-death-day').value;
        const deathDay = deathDayVal ? parseInt(deathDayVal, 10) : null;
        
        const deathAgeVal = document.getElementById('member-death-age').value;
        const deathAge = deathAgeVal ? parseInt(deathAgeVal, 10) : null;

        if (editingMemberId) {
            // Update existing
            const index = familyMembers.findIndex(m => m.id === editingMemberId);
            if (index !== -1) {
                familyMembers[index] = {
                    id: editingMemberId,
                    name,
                    birthYear,
                    birthMonth,
                    birthDay,
                    deathYear,
                    deathMonth,
                    deathDay,
                    deathAge
                };
            }
            editingMemberId = null;
        } else {
            // Create new
            const newMember = {
                id: generateId(),
                name,
                birthYear,
                birthMonth,
                birthDay,
                deathYear,
                deathMonth,
                deathDay,
                deathAge
            };
            familyMembers.push(newMember);
        }

        saveData();
        renderGrid();
        closeModal();
    });

    // Delete Member
    function deleteMember(id) {
        if (confirm('Are you sure you want to delete this family member?')) {
            familyMembers = familyMembers.filter(m => m.id !== id);
            saveData();
            renderGrid();
        }
    }

    // Auto-update Year Range
    function updateRange() {
        const start = parseInt(startYearInput.value, 10);
        const end = parseInt(endYearInput.value, 10);
        
        if (start && end && start <= end) {
            currentStartYear = start;
            currentEndYear = end;
            saveData();
            renderGrid();
        }
        if (startPresetSelect) startPresetSelect.value = "";
        if (endPresetSelect) endPresetSelect.value = "";
    }

    if (startYearInput) startYearInput.addEventListener('change', updateRange);
    if (endYearInput) endYearInput.addEventListener('change', updateRange);

    // Range Presets Helper
    function applyPreset(preset, isStart) {
        if (!preset) return;

        const currentYear = new Date().getFullYear();
        const birthYears = familyMembers.map(m => m.birthYear);
        const deathYears = familyMembers.filter(m => m.deathYear).map(m => m.deathYear);
        
        let targetYear = null;
        let currentValue = isStart ? parseInt(startYearInput.value, 10) : parseInt(endYearInput.value, 10);

        if (preset === 'all') {
            if (familyMembers.length > 0) {
                startYearInput.value = Math.min(...birthYears);
                endYearInput.value = currentYear;
                currentStartYear = parseInt(startYearInput.value, 10);
                currentEndYear = parseInt(endYearInput.value, 10);
                saveData();
                renderGrid();
            }
            if (isStart && startPresetSelect) startPresetSelect.value = "";
            else if (!isStart && endPresetSelect) endPresetSelect.value = "";
            return;
        }

        switch(preset) {
            case 'this-year':
                targetYear = currentYear;
                break;
            case 'first-born':
                if (familyMembers.length > 0) targetYear = Math.min(...birthYears);
                break;
            case 'last-born':
                if (familyMembers.length > 0) targetYear = Math.max(...birthYears);
                break;
            case 'first-dead':
                if (deathYears.length > 0) targetYear = Math.min(...deathYears);
                break;
            case 'last-dead':
                if (deathYears.length > 0) targetYear = Math.max(...deathYears);
                break;
            case 'minus-10':
                if (!isNaN(currentValue)) targetYear = currentValue - 10;
                break;
            case 'plus-10':
                if (!isNaN(currentValue)) targetYear = currentValue + 10;
                break;
        }

        if (targetYear !== null) {
            if (isStart) {
                startYearInput.value = targetYear;
                if (parseInt(endYearInput.value, 10) < targetYear) endYearInput.value = targetYear;
            } else {
                endYearInput.value = targetYear;
                if (parseInt(startYearInput.value, 10) > targetYear) startYearInput.value = targetYear;
            }
            
            currentStartYear = parseInt(startYearInput.value, 10);
            currentEndYear = parseInt(endYearInput.value, 10);
            saveData();
            renderGrid();
        }

        // Reset the select element so the same option can be chosen again
        if (isStart && startPresetSelect) {
            startPresetSelect.value = "";
        } else if (!isStart && endPresetSelect) {
            endPresetSelect.value = "";
        }
    }

    if (startPresetSelect) {
        startPresetSelect.addEventListener('change', (e) => applyPreset(e.target.value, true));
    }
    if (endPresetSelect) {
        endPresetSelect.addEventListener('change', (e) => applyPreset(e.target.value, false));
    }

    // Center on Year Logic
    function centerOnYear(center) {
        if (isNaN(center)) return;
        
        const spanInput = document.getElementById('center-span');
        const span = parseInt(spanInput ? spanInput.value : 5, 10);
        
        currentStartYear = center - span;
        currentEndYear = center + span;
        
        startYearInput.value = currentStartYear;
        endYearInput.value = currentEndYear;
        
        saveData();
        renderGrid();
    }

    const centerYearInput = document.getElementById('center-year');
    if (centerYearInput) {
        centerYearInput.addEventListener('change', (e) => {
            const center = parseInt(e.target.value, 10);
            centerOnYear(center);
            e.target.value = '';
        });
    }

    const centerYearDropdown = document.getElementById('center-year-dropdown');
    
    function updateCenterDropdown() {
        if (!centerYearDropdown) return;
        
        let minYear = new Date().getFullYear();
        let maxYear = new Date().getFullYear();
        
        if (familyMembers.length > 0) {
            const birthYears = familyMembers.map(m => m.birthYear);
            const deathYears = familyMembers.filter(m => m.deathYear).map(m => m.deathYear);
            minYear = Math.min(...birthYears);
            maxYear = Math.max(...deathYears, new Date().getFullYear());
        }
        
        // Populate options
        centerYearDropdown.innerHTML = '<option value="">Year...</option>';
        for (let y = minYear; y <= maxYear; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            centerYearDropdown.appendChild(option);
        }
    }
    
    if (centerYearDropdown) {
        centerYearDropdown.addEventListener('change', (e) => {
            const center = parseInt(e.target.value, 10);
            if (!isNaN(center)) {
                centerOnYear(center);
            }
            e.target.value = '';
        });
    }

    // Export Data
    exportBtn.addEventListener('click', () => {
        const data = {
            familyMembers,
            startYear: currentStartYear,
            endYear: currentEndYear
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "family-ages-export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Import Data
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.familyMembers && Array.isArray(data.familyMembers)) {
                    familyMembers = data.familyMembers;
                    if (data.startYear) currentStartYear = data.startYear;
                    if (data.endYear) currentEndYear = data.endYear;
                    
                    saveData();
                    startYearInput.value = currentStartYear;
                    endYearInput.value = currentEndYear;
                    renderGrid();
                    alert('Data imported successfully!');
                } else {
                    alert('Invalid file format.');
                }
            } catch (error) {
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
        // Reset file input
        importFile.value = '';
    });

    // Reset Data
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all data? This will erase the entire list.')) {
                familyMembers = [];
                const currentYear = new Date().getFullYear();
                currentStartYear = currentYear - 10;
                currentEndYear = currentYear + 10;
                startYearInput.value = currentStartYear;
                endYearInput.value = currentEndYear;
                saveData();
                renderGrid();
            }
        });
    }

    // Load Demo Data
    const loadDemoBtn = document.getElementById('load-demo-btn');
    if (loadDemoBtn) {
        loadDemoBtn.addEventListener('click', () => {
            if (confirm('This will load example data. Any existing data will be replaced. Continue?')) {
                familyMembers = [
                    { id: generateId(), name: "Eleanor (Grandma)", birthYear: 1942, deathYear: 2021, deathMonth: 5, deathDay: 12 },
                    { id: generateId(), name: "Arthur (Grandpa)", birthYear: 1938, deathYear: 2005, deathMonth: 11, deathDay: 2 },
                    { id: generateId(), name: "Sarah (Mom)", birthYear: 1970 },
                    { id: generateId(), name: "Michael (Dad)", birthYear: 1968 },
                    { id: generateId(), name: "Jessica (Me)", birthYear: 1995 },
                    { id: generateId(), name: "David (Brother)", birthYear: 1998 },
                    { id: generateId(), name: "Emma (Niece)", birthYear: 2023 }
                ];
                currentStartYear = 1930;
                currentEndYear = 2030;
                startYearInput.value = currentStartYear;
                endYearInput.value = currentEndYear;
                saveData();
                renderGrid();
            }
        });
    }

    // Sort Order change
    if (sortOrderSelect) {
        sortOrderSelect.addEventListener('change', (e) => {
            currentSortOrder = e.target.value;
            saveData();
            renderGrid();
        });
    }

    // Initialization
    loadData();
    renderGrid();
});
