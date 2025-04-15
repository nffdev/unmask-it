# Unmask it

> *Unmask the malware before it unmasks you!*

**Unmask it** is a web-based static malware analyzer. It automatically extracts the configuration of a malicious file without execution, providing fast and safe analysis.

 **Website**: [https://www.unmaskit.org](https://www.unmaskit.org)

---

## 📌 Features

-  Static analysis of malicious files
-  Automatic extraction of internal configurations
-  Intuitive web interface with drag-and-drop support
-  Analysis dashboard with detailed statistics

---

## 🚀 Getting Started

To run Unmask it locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/nffdev/unmask-it.git
cd unmask-it
```

### 2. Install and run the backend
```bash
cd Back
npm install
# Create a .env file with your MongoDB URI and PORT
cp .env.example .env
# Edit .env as needed
npm run dev
```

### 3. Install and run the frontend
Open a new terminal:
```bash
cd Front
npm install
npm run dev
```

The frontend will be available by default at [http://localhost:5173](http://localhost:5173) and the backend API at [http://localhost:8080](http://localhost:8080).

---

## 🌐 Usage (Web)

1. Go to: [unmaskit.org](https://www.unmaskit.org)
2. Drag and drop a suspicious file or click to select one
3. Analysis starts automatically and displays the results
4. View extracted configurations and associated metadata

---

## 🤝 Contributing

Contributions are welcome! To participate:

1. Fork this repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add a feature'`)
4. Push the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## Contact

For any questions or suggestions:

- 🐙 GitHub: [nffdev/unmask-it](https://github.com/nffdev/unmask-it)