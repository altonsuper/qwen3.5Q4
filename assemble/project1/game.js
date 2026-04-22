<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neon Core - Interactive Element</title>
    
    <!-- External CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        /* CSS Variables for Neon Theme */
        :root {
            --neon-green: #00ff00;
            --neon-green-dim: #00cc00;
            --neon-black: #000000;
            --neon-black-dim: #000000;
            --bg-color: #050505;
            --card-bg: rgba(0, 20, 0, 0.8);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: var(--bg-color);
            color: var(--neon-green);
            font-family: 'Courier New', Courier, monospace;
            overflow-x: hidden;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        /* Main Container */
        .container {
            width: 100%;
            max-width: 800px;
            padding: 20px;
            text-align: center;
        }

        /* Header */
        header {
            margin-bottom: 40px;
            border-bottom: 2px solid var(--neon-green);
            padding-bottom: 20px;
        }

        h1 {
            font-size: 3rem;
            text-transform: uppercase;
            letter-spacing: 5px;
            text-shadow: 0 0 10px var(--neon-green), 0 0 20px var(--neon-green);
            margin-bottom: 10px;
        }

        p.subtitle {
            font-size: 1.2rem;
            opacity: 0.8;
        }

        /* Card Layout */
        .card {
            background: var(--card-bg);
            border: 1px solid var(--neon-green);
            padding: 40px;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 20px rgba(0, 255, 0, 0.1);
            position: relative;
            overflow: hidden;
        }

        /* Neon Border Effect */
        .card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
            transform: rotate(45deg);
            pointer-events: none;
        }

        /* Typography */
        h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            color: var(--neon-green);
        }

        /* Button */
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 15px 30px;
            background: transparent;
            color: var(--neon-green);
            border: 2px solid var(--neon-green);
            font-family: 'Courier New', monospace;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            position: relative;
            overflow: hidden;
        }

        .btn:hover {
            background: var(--neon-green);
            color: var(--neon-black);
            box-shadow: 0 0 20px var(--neon-green);
        }

        /* Footer */
        footer {
            margin-top: 50px;
            font-size: 0.8rem;
            opacity: 0.5;
        }

        /* Mobile Adjustments */
        @media (max-width: 600px) {
            h1 { font-size: 2rem; }
            .card { padding: 20px; }
        }
    </style>
</head>
<body>

    <div class="container">
        <header>
            <h1>NEON CORE</h1>
            <p class="subtitle">Cyberpunk Interface</p>
        </header>

        <div class="card">
            <h2>System Status</h2>
            <p>
                <i class="fa-solid fa-wifi"></i> Network Active
            </p>
            <p>
                <i class="fa-solid fa-satellite-dish"></i> Signal: 100%
            </p>
            <p>
                <i class="fa-solid fa-shield-halved"></i> Security: Secure
            </p>
            
            <button class="btn">Initialize System</button>
        </div>

        <footer>
            &copy; 2023 Neon Core Systems
        </footer>
    </div>

    <script>
        // Simple JS for interactivity
        document.querySelector('button').addEventListener('click', function() {
            this.style.backgroundColor = '#00ff00';
            this.style.color = '#000';
            this.style.borderColor = '#00ff00';
            
            setTimeout(() => {
                this.style.backgroundColor = 'transparent';
                this.style.color = '#00ff00';
                this.style.borderColor = '#00ff00';
            }, 300);
        });
    </script>
</body>
</html>