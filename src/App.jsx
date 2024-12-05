import React, { useState } from "react";

// Sample user data
const users = [
  {
    id: "001",
    name: "John Doe",
    subscriptionActive: true,
    hospitalCredits: 2,
    ambulatoryCredits: 3,
  },
  {
    id: "002",
    name: "Jane Smith",
    subscriptionActive: false,
    hospitalCredits: 0,
    ambulatoryCredits: 0,
  },
  {
    id: "003",
    name: "Michael Brown",
    subscriptionActive: true,
    hospitalCredits: 1,
    ambulatoryCredits: 2,
  },
  {
    id: "004",
    name: "Emily White",
    subscriptionActive: true,
    hospitalCredits: 2,
    ambulatoryCredits: 3,
  },
  {
    id: "005",
    name: "Daniel Green",
    subscriptionActive: false,
    hospitalCredits: 0,
    ambulatoryCredits: 1,
  },
];

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // NFC scan function
  const handleScan = async () => {
    if (!("NDEFReader" in window)) {
      alert("NFC non disponible sur ce navigateur !");
      return;
    }

    try {
      setIsScanning(true);
      const ndef = new NDEFReader();
      await ndef.scan();
      console.log("> Scan started");

      ndef.addEventListener("reading", ({ serialNumber }) => {
        console.log(`> Serial Number: ${serialNumber}`);
        const user = users.find((u) => u.id === serialNumber);
        if (user) {
          setScanResult(user);
        } else {
          alert("Utilisateur introuvable !");
        }
        setIsScanning(false);
      });
    } catch (error) {
      console.error("Erreur lors du scan NFC :", error);
      alert("Une erreur est survenue lors du scan.");
      setIsScanning(false);
    }
  };

  // NFC write function
  const handleWrite = async (id) => {
    try {
      const ndef = new NDEFReader();
      await ndef.write(id);
      console.log("> ID écrit sur la carte NFC :", id);
      alert("ID écrit sur la carte NFC !");
    } catch (error) {
      console.error("Erreur lors de l'écriture NFC :", error);
      alert("Une erreur est survenue lors de l'écriture.");
    }
  };

  return (
    <div className="app bg-gray-100 p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Gestion NFC pour la Mutuelle de Santé
      </h1>

      {/* List of users */}
      {!selectedUser && (
        <div className="user-list mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Liste des utilisateurs
          </h2>
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="p-4 bg-white shadow rounded flex justify-between items-center"
              >
                <span className="text-lg font-medium">{user.name}</span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setSelectedUser(user)}
                >
                  Détails
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Details */}
      {selectedUser && (
        <div className="user-details bg-white p-6 shadow rounded mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Détails de l'utilisateur
          </h2>
          <p className="mb-2">
            Nom : <span className="font-medium">{selectedUser.name}</span>
          </p>
          <p className="mb-2">
            Abonnement Actif :{" "}
            <span className="font-medium">
              {selectedUser.subscriptionActive ? "Oui" : "Non"}
            </span>
          </p>
          <p className="mb-2">
            Crédits Hospitalisation :{" "}
            <span className="font-medium">{selectedUser.hospitalCredits}</span>
          </p>
          <p className="mb-4">
            Crédits Ambulatoires :{" "}
            <span className="font-medium">
              {selectedUser.ambulatoryCredits}
            </span>
          </p>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleWrite(selectedUser.id)}
            >
              Écrire sur la Carte
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => setSelectedUser(null)}
            >
              Retour
            </button>
          </div>
        </div>
      )}

      {/* NFC Scan */}
      <div className="nfc-scan bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-semibold mb-4">Scan NFC</h2>
        <button
          className={`px-4 py-2 rounded mb-4 ${
            isScanning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? "Scan en cours..." : "Scanner une Carte"}
        </button>
        {scanResult && (
          <div className="scan-result">
            <p className="mb-2">
              Nom : <span className="font-medium">{scanResult.name}</span>
            </p>
            <p className="mb-2">
              Abonnement Actif :{" "}
              <span className="font-medium">
                {scanResult.subscriptionActive ? "Oui" : "Non"}
              </span>
            </p>
            <p className="mb-2">
              Crédits Hospitalisation :{" "}
              <span className="font-medium">{scanResult.hospitalCredits}</span>
            </p>
            <p>
              Crédits Ambulatoires :{" "}
              <span className="font-medium">
                {scanResult.ambulatoryCredits}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
