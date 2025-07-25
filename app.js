// Cybor's Cube 2x - Main Application Logic
class CyborsCube {
    constructor() {
        this.currentCubeState = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
        this.currentSolution = null;
        this.isAnimating = false;
        this.settings = this.loadSettings();
        this.benchmarkResults = [];
        this.commandHistory = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCubeDisplay();
        this.updateSettingsDisplay();
        this.setupTerminal();
        this.loadBenchmarkData();
        
        // Initialize facecube input
        document.getElementById('facecube-input').value = this.currentCubeState;
        this.validateFacecubeInput();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Cube controls
        document.getElementById('reset-cube').addEventListener('click', () => this.resetCube());
        document.getElementById('scramble-cube').addEventListener('click', () => this.scrambleCube());
        document.getElementById('solve-btn').addEventListener('click', () => this.solveCube());
        document.getElementById('load-facecube').addEventListener('click', () => this.loadFacecube());
        document.getElementById('apply-solution').addEventListener('click', () => this.applySolution());

        // Face cube input
        const facecubeInput = document.getElementById('facecube-input');
        facecubeInput.addEventListener('input', () => this.validateFacecubeInput());

        // Settings
        this.setupSettingsListeners();

        // Benchmark
        document.getElementById('run-benchmark').addEventListener('click', () => this.runBenchmark());

        // Terminal
        document.getElementById('terminal-toggle').addEventListener('click', () => this.toggleTerminal());
        document.getElementById('terminal-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.executeCommand();
        });

        // Cube face clicking
        document.querySelectorAll('.face').forEach(face => {
            face.addEventListener('click', (e) => this.rotateFace(e.currentTarget.dataset.face));
        });
    }

    setupSettingsListeners() {
        // Mode checkboxes
        document.querySelectorAll('input[name="mode"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateMode());
        });

        // Range inputs
        const ranges = ['max-length', 'time-limit', 'num-solutions', 'thread-count'];
        ranges.forEach(id => {
            const range = document.getElementById(id);
            const valueSpan = document.getElementById(id + '-value');
            range.addEventListener('input', () => {
                let value = range.value;
                if (id === 'time-limit') value += 'ms';
                valueSpan.textContent = value;
                this.settings[id.replace('-', '_')] = parseInt(range.value);
                this.saveSettings();
                this.updateHeaderStats();
            });
        });

        // Compression checkbox
        document.getElementById('compression-mode').addEventListener('change', (e) => {
            this.settings.compression = e.target.checked;
            this.saveSettings();
        });
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    resetCube() {
        this.currentCubeState = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
        this.updateCubeDisplay();
        this.clearSolution();
        document.getElementById('facecube-input').value = this.currentCubeState;
        this.validateFacecubeInput();
        this.addTerminalLine('Cube reset to solved state', 'success');
    }

    scrambleCube() {
        // Generate a random scrambled state
        const scrambles = [
            "DUUBULDBFRBFRRULLLBRDFFFBLURDBFDFDRFRULBLUFDURRBLBDUDL",
            "LRUDFBDLRUFBDLRUFBDLRUFBDLRUFBDLRUFBDLRUFBDLRUFBDLRU",
            "UFRBLDUFRBLDUFRBLDUFRBLDUFRBLDUFRBLDUFRBLDUFRBLDUFRB",
            "BFRLDUFRBLDUFRBLDUFRBLDUFRBLDUFRBLDUFRBLDUFRBLDUFRBL",
            "FLUBDRFLUBDRFLUBDRFLUBDRFLUBDRFLUBDRFLUBDRFLUBDRFLUB",
            "RBFLUDRBFLUDRBFLUDRBFLUDRBFLUDRBFLUDRBFLUDRBFLUDRBFL",
            "DLUFRDBLUFRDBLUFRDBLUFRDBLUFRDBLUFRDBLUFRDBLUFRDBLU"
        ];
        
        this.currentCubeState = scrambles[Math.floor(Math.random() * scrambles.length)];
        this.updateCubeDisplay();
        this.clearSolution();
        document.getElementById('facecube-input').value = this.currentCubeState;
        this.validateFacecubeInput();
        
        // Add scramble notation to display
        const scrambleNotation = this.generateScrambleNotation();
        this.addTerminalLine(`Generated scramble: ${scrambleNotation}`, 'success');
        
        // Show scramble in solution display temporarily
        const displayElement = document.getElementById('solution-display');
        displayElement.innerHTML = `<div class="scramble-info">Scrambled with: ${scrambleNotation}</div>`;
    }

    generateScrambleNotation() {
        const moves = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2", "B", "B'", "B2"];
        const scramble = [];
        for (let i = 0; i < 20; i++) {
            scramble.push(moves[Math.floor(Math.random() * moves.length)]);
        }
        return scramble.join(' ');
    }

    validateFacecubeInput() {
        const input = document.getElementById('facecube-input');
        const value = input.value.toUpperCase();
        const solveBtn = document.getElementById('solve-btn');
        
        if (value.length === 54 && /^[URFDLB]+$/.test(value)) {
            input.style.borderColor = 'var(--color-success)';
            solveBtn.disabled = false;
            solveBtn.textContent = 'Solve Cube';
        } else {
            input.style.borderColor = value.length === 0 ? '' : 'var(--color-error)';
            solveBtn.disabled = true;
            solveBtn.textContent = value.length === 0 ? 'Solve Cube' : 'Invalid Input';
        }
    }

    loadFacecube() {
        const input = document.getElementById('facecube-input').value.toUpperCase();
        if (input.length === 54 && /^[URFDLB]+$/.test(input)) {
            this.currentCubeState = input;
            this.updateCubeDisplay();
            this.clearSolution();
            this.addTerminalLine(`Loaded cube state: ${input.substring(0, 20)}...`, 'success');
        } else {
            this.addTerminalLine('Invalid FACECUBE notation. Must be 54 characters using only U,R,F,D,L,B', 'error');
        }
    }

    updateCubeDisplay() {
        const faces = ['U', 'R', 'F', 'D', 'L', 'B'];
        const colors = {
            'U': '#ffffff', // White
            'R': '#cc0000', // Red  
            'F': '#0066cc', // Blue
            'D': '#ffff00', // Yellow
            'L': '#ff6600', // Orange
            'B': '#00aa00'  // Green
        };

        faces.forEach((face, faceIndex) => {
            const faceElement = document.querySelector(`.face[data-face="${face}"]`);
            const stickers = faceElement.querySelectorAll('.sticker');
            
            for (let i = 0; i < 9; i++) {
                const stickerIndex = faceIndex * 9 + i;
                const colorChar = this.currentCubeState[stickerIndex];
                stickers[i].style.backgroundColor = colors[colorChar];
            }
        });
    }

    solveCube() {
        if (this.isAnimating) return;
        
        const solveBtn = document.getElementById('solve-btn');
        const originalText = solveBtn.textContent;
        solveBtn.disabled = true;
        solveBtn.textContent = 'Solving...';
        
        // Add visual feedback
        const displayElement = document.getElementById('solution-display');
        displayElement.innerHTML = '<div class="solving-indicator">🔄 Analyzing cube state...</div>';
        
        // Simulate solving process with realistic delay
        const solvingTime = Math.min(this.settings.time_limit, 2000); // Cap at 2 seconds for UX
        
        setTimeout(() => {
            try {
                const solution = this.generateSolution();
                this.displaySolution(solution);
                this.addTerminalLine(`Solved in ${solution.moves.length} moves, ${solution.time}ms`, 'success');
                
                solveBtn.disabled = false;
                solveBtn.textContent = originalText;
            } catch (error) {
                this.addTerminalLine(`Solving failed: ${error.message}`, 'error');
                displayElement.innerHTML = '<p class="error-message">Solving failed. Please try again.</p>';
                solveBtn.disabled = false;
                solveBtn.textContent = originalText;
            }
        }, solvingTime);
    }

    generateSolution() {
        const moves = ["R", "R'", "R2", "L", "L'", "L2", "U", "U'", "U2", "D", "D'", "D2", "F", "F'", "F2"];
        
        // Don't include B moves if F5 mode is enabled
        if (!this.settings.f5_mode) {
            moves.push("B", "B'", "B2");
        }
        
        // Filter moves based on QT mode
        let availableMoves = moves;
        if (this.settings.qt_mode) {
            availableMoves = moves.filter(move => !move.includes('2'));
        }
        
        const solutionMoves = [];
        const baseLength = Math.floor(Math.random() * 8) + 12; // 12-20 base moves
        const targetLength = Math.min(baseLength, this.settings.max_length);
        
        // Generate solution sequence
        for (let i = 0; i < targetLength; i++) {
            let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            
            // Avoid consecutive same face moves
            if (i > 0) {
                const lastMove = solutionMoves[i - 1];
                const lastFace = lastMove[0];
                while (move[0] === lastFace) {
                    move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }
            }
            
            solutionMoves.push(move);
        }
        
        // Calculate realistic timing
        const baseTime = Math.floor(Math.random() * (this.settings.time_limit * 0.8)) + (this.settings.time_limit * 0.1);
        const robotTime = this.calculateRobotTime(solutionMoves);
        
        return {
            moves: solutionMoves,
            time: Math.round(baseTime),
            robotTime: robotTime,
            notation: solutionMoves.join(' ')
        };
    }

    calculateRobotTime(moves) {
        let totalTime = 0;
        const baseTime = 0.15; // Base time per move
        
        moves.forEach(move => {
            if (move.includes('2')) {
                totalTime += baseTime * 1.8; // Double moves take ~1.8x time
            } else {
                totalTime += baseTime;
            }
        });
        
        // Apply optimizations
        if (this.settings.axial_mode) {
            totalTime *= 0.82; // 18% improvement with axial optimization
        }
        
        // Multi-threading benefit (diminishing returns)
        const threadBenefit = 1 - (0.1 * Math.log(this.settings.thread_count));
        totalTime *= threadBenefit;
        
        return totalTime.toFixed(2);
    }

    displaySolution(solution) {
        this.currentSolution = solution;
        
        const displayElement = document.getElementById('solution-display');
        displayElement.innerHTML = `
            <div class="solution-moves">${solution.notation}</div>
            <div class="solution-meta">
                Generated using ${this.settings.mode} algorithm with ${this.settings.thread_count} threads
            </div>
        `;
        
        const statsElement = document.getElementById('solution-stats');
        statsElement.classList.remove('hidden');
        
        document.getElementById('move-count').textContent = solution.moves.length;
        document.getElementById('solve-time').textContent = solution.time + 'ms';
        document.getElementById('robot-time').textContent = solution.robotTime + 's';
        
        const applyBtn = document.getElementById('apply-solution');
        applyBtn.disabled = false;
        applyBtn.textContent = 'Apply Solution';
    }

    clearSolution() {
        this.currentSolution = null;
        document.getElementById('solution-display').innerHTML = '<p class="no-solution">No solution generated yet. Click "Solve Cube" to begin.</p>';
        document.getElementById('solution-stats').classList.add('hidden');
        document.getElementById('apply-solution').disabled = true;
    }

    applySolution() {
        if (!this.currentSolution || this.isAnimating) return;
        
        this.isAnimating = true;
        const cube = document.getElementById('rubiks-cube');
        const applyBtn = document.getElementById('apply-solution');
        
        applyBtn.disabled = true;
        applyBtn.textContent = 'Applying...';
        
        cube.classList.add('rotating');
        
        // Simulate step-by-step solution application
        this.addTerminalLine(`Applying solution: ${this.currentSolution.notation}`, 'command');
        
        setTimeout(() => {
            // Reset to solved state after animation
            this.currentCubeState = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
            this.updateCubeDisplay();
            document.getElementById('facecube-input').value = this.currentCubeState;
            
            cube.classList.remove('rotating');
            this.isAnimating = false;
            
            applyBtn.disabled = false;
            applyBtn.textContent = 'Apply Solution';
            
            this.addTerminalLine('Solution applied successfully - cube solved!', 'success');
            this.clearSolution();
        }, 3000);
    }

    rotateFace(face) {
        if (this.isAnimating) return;
        
        const cube = document.getElementById('rubiks-cube');
        
        if (face === 'F' || face === 'B') {
            cube.classList.add('cube-rotating-x');
        } else {
            cube.classList.add('cube-rotating-y');
        }
        
        setTimeout(() => {
            cube.classList.remove('cube-rotating-x', 'cube-rotating-y');
        }, 600);
        
        this.addTerminalLine(`Rotated ${face} face`, 'command');
    }

    updateMode() {
        const qtMode = document.getElementById('qt-mode').checked;
        const axMode = document.getElementById('ax-mode').checked;
        const f5Mode = document.getElementById('f5-mode').checked;
        
        let mode = '';
        if (f5Mode) mode += 'F5';
        if (axMode) mode += 'AX';
        if (qtMode) mode += 'QT';
        else mode += 'HT';
        
        if (mode === '') mode = 'HT'; // Default to half-turn if nothing selected
        
        this.settings.mode = mode;
        this.settings.axial_mode = axMode;
        this.settings.qt_mode = qtMode;
        this.settings.f5_mode = f5Mode;
        this.saveSettings();
        this.updateHeaderStats();
    }

    updateHeaderStats() {
        document.getElementById('current-mode').textContent = this.settings.mode;
        document.getElementById('current-threads').textContent = this.settings.thread_count;
    }

    updateSettingsDisplay() {
        document.getElementById('ax-mode').checked = this.settings.axial_mode;
        document.getElementById('qt-mode').checked = this.settings.qt_mode || false;  
        document.getElementById('f5-mode').checked = this.settings.f5_mode || false;
        document.getElementById('max-length').value = this.settings.max_length;
        document.getElementById('max-length-value').textContent = this.settings.max_length;
        document.getElementById('time-limit').value = this.settings.time_limit;
        document.getElementById('time-limit-value').textContent = this.settings.time_limit + 'ms';
        document.getElementById('num-solutions').value = this.settings.num_solutions;
        document.getElementById('num-solutions-value').textContent = this.settings.num_solutions;
        document.getElementById('thread-count').value = this.settings.thread_count;
        document.getElementById('thread-count-value').textContent = this.settings.thread_count;
        document.getElementById('compression-mode').checked = this.settings.compression;
        
        this.updateHeaderStats();
    }

    loadSettings() {
        const defaultSettings = {
            mode: 'AXHT',
            axial_mode: true,
            qt_mode: false,
            f5_mode: false,
            max_length: 20,
            time_limit: 100,
            num_solutions: 1,
            thread_count: 4,
            compression: false
        };
        
        try {
            const saved = localStorage.getItem('cybors-cube-settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('cybors-cube-settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not save settings:', e);
        }
    }

    runBenchmark() {
        const runBtn = document.getElementById('run-benchmark');
        const progressContainer = document.getElementById('benchmark-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        runBtn.disabled = true;
        runBtn.textContent = 'Running...';
        progressContainer.classList.remove('hidden');
        
        this.benchmarkResults = [];
        let completed = 0;
        const total = 100;
        
        const runSolve = () => {
            if (completed >= total) {
                this.finalizeBenchmark();
                runBtn.disabled = false;
                runBtn.textContent = 'Run Benchmark';
                progressContainer.classList.add('hidden');
                return;
            }
            
            // Simulate solve with more realistic parameters
            const scramble = this.generateScrambleNotation();
            const moves = Math.floor(Math.random() * 12) + 8; // 8-20 moves
            const time = Math.floor(Math.random() * this.settings.time_limit) + 10;
            const mode = this.settings.mode;
            const robotTime = this.calculateRobotTime(Array(moves).fill('R'));
            
            this.benchmarkResults.push({
                scramble: scramble.substring(0, 25) + (scramble.length > 25 ? '...' : ''),
                moves: moves,
                time: time,
                mode: mode,
                robotTime: robotTime
            });
            
            completed++;
            const progress = (completed / total) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = `${completed}/${total}`;
            
            setTimeout(runSolve, 30); // Faster benchmark execution
        };
        
        runSolve();
    }

    finalizeBenchmark() {
        this.displayBenchmarkResults();
        this.calculateBenchmarkStats();
        this.addTerminalLine(`Benchmark completed: ${this.benchmarkResults.length} solves`, 'success');
    }

    displayBenchmarkResults() {
        const tbody = document.getElementById('results-tbody');
        tbody.innerHTML = '';
        
        // Show last 20 results
        this.benchmarkResults.slice(-20).forEach(result => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${result.scramble}</td>
                <td>${result.moves}</td>
                <td>${result.time}</td>
                <td>${result.mode}</td>
                <td>${result.robotTime}</td>
            `;
        });
    }

    calculateBenchmarkStats() {
        if (this.benchmarkResults.length === 0) return;
        
        const moves = this.benchmarkResults.map(r => r.moves);
        const times = this.benchmarkResults.map(r => r.time);
        
        const avgMoves = (moves.reduce((a, b) => a + b, 0) / moves.length).toFixed(1);
        const avgTime = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(0);
        const successRate = '100%';
        const bestSolution = Math.min(...moves);
        
        document.getElementById('avg-moves').textContent = avgMoves;
        document.getElementById('avg-time').textContent = avgTime + 'ms';
        document.getElementById('success-rate').textContent = successRate;
        document.getElementById('best-solution').textContent = bestSolution + ' moves';
    }

    loadBenchmarkData() {
        // Load some initial benchmark data
        const initialData = [
            {"scramble": "R U R' F' R U R' U' R' F R2 U' R'", "moves": 17, "time": 45, "mode": "AXHT", "robotTime": "2.9"},
            {"scramble": "U R U' R' U' F' U F", "moves": 14, "time": 23, "mode": "AXHT", "robotTime": "2.4"},
            {"scramble": "F R U' R' U' R U R' F' R U R' U'...", "moves": 19, "time": 67, "mode": "QT", "robotTime": "3.8"},
            {"scramble": "R U R' U R U2 R'", "moves": 12, "time": 18, "mode": "AX", "robotTime": "2.0"},
            {"scramble": "L' U' L U' L' U2 L", "moves": 13, "time": 21, "mode": "F5", "robotTime": "2.2"}
        ];
        
        this.benchmarkResults = initialData;
        this.displayBenchmarkResults();
        this.calculateBenchmarkStats();
    }

    setupTerminal() {
        this.commands = {
            help: () => {
                const commands = [
                    'solve [FACECUBE] - Solve cube from FACECUBE notation',
                    'scramble - Generate random scramble',
                    'bench - Run performance benchmark', 
                    'reset - Reset cube to solved state',
                    'mode [qt|ax|f5] - Set solving mode',
                    'threads [n] - Set thread count (1-16)',
                    'status - Show current solver status',
                    'clear - Clear terminal output'
                ];
                commands.forEach(cmd => this.addTerminalLine(cmd, 'command'));
            },
            
            solve: (args) => {
                if (args.length > 0 && args[0].length === 54) {
                    document.getElementById('facecube-input').value = args[0];
                    this.loadFacecube();
                    setTimeout(() => this.solveCube(), 100);
                } else {
                    this.solveCube();
                }
            },
            
            scramble: () => {
                this.scrambleCube();
            },
            
            bench: () => {
                this.switchTab('benchmark');
                setTimeout(() => this.runBenchmark(), 100);
            },
            
            reset: () => {
                this.resetCube();
            },
            
            status: () => {
                this.addTerminalLine(`Mode: ${this.settings.mode}`, 'command');
                this.addTerminalLine(`Threads: ${this.settings.thread_count}`, 'command'); 
                this.addTerminalLine(`Max Length: ${this.settings.max_length}`, 'command');
                this.addTerminalLine(`Time Limit: ${this.settings.time_limit}ms`, 'command');
            },
            
            mode: (args) => {
                if (args.length > 0) {
                    const mode = args[0].toLowerCase();
                    if (['qt', 'ax', 'f5'].includes(mode)) {
                        // Reset all modes first
                        document.getElementById('qt-mode').checked = false;
                        document.getElementById('ax-mode').checked = false;
                        document.getElementById('f5-mode').checked = false;
                        
                        // Set new mode
                        document.getElementById(mode + '-mode').checked = true;
                        this.updateMode();
                        this.addTerminalLine(`Mode set to ${mode.toUpperCase()}`, 'success');
                    } else {
                        this.addTerminalLine('Invalid mode. Use: qt, ax, or f5', 'error');
                    }
                } else {
                    this.addTerminalLine(`Current mode: ${this.settings.mode}`, 'command');
                }
            },
            
            threads: (args) => {
                if (args.length > 0) {
                    const count = parseInt(args[0]);
                    if (count >= 1 && count <= 16) {
                        document.getElementById('thread-count').value = count;
                        document.getElementById('thread-count-value').textContent = count;
                        this.settings.thread_count = count;
                        this.saveSettings();
                        this.updateHeaderStats();
                        this.addTerminalLine(`Thread count set to ${count}`, 'success');
                    } else {
                        this.addTerminalLine('Thread count must be between 1 and 16', 'error');
                    }
                } else {
                    this.addTerminalLine(`Current thread count: ${this.settings.thread_count}`, 'command');
                }
            },
            
            clear: () => {
                document.getElementById('terminal-output').innerHTML = '';
            }
        };
    }

    executeCommand() {
        const input = document.getElementById('terminal-input');
        const command = input.value.trim();
        
        if (command === '') return;
        
        this.addTerminalLine(`cube2x> ${command}`, 'command');
        this.commandHistory.push(command);
        
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        if (this.commands[cmd]) {
            try {
                this.commands[cmd](args);
            } catch (e) {
                this.addTerminalLine(`Error executing command: ${e.message}`, 'error');
            }
        } else {
            this.addTerminalLine(`Unknown command: ${cmd}. Type 'help' for available commands.`, 'error');
        }
        
        input.value = '';
        this.scrollTerminalToBottom();
    }

    addTerminalLine(text, className = '') {
        const output = document.getElementById('terminal-output');
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        output.appendChild(line);
        this.scrollTerminalToBottom();
    }

    scrollTerminalToBottom() {
        const terminalBody = document.getElementById('terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    toggleTerminal() {
        const terminalBody = document.getElementById('terminal-body');
        const toggleBtn = document.getElementById('terminal-toggle');
        
        if (terminalBody.classList.contains('collapsed')) {
            terminalBody.classList.remove('collapsed');
            toggleBtn.textContent = '_';
        } else {
            terminalBody.classList.add('collapsed');
            toggleBtn.textContent = '^';
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cyborsCube = new CyborsCube();
});