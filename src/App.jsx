import React, { useState } from "react";

// Sample user data
const users = [
  {
    id: "001",
    name: "John Doe",
    age: 34,
    address: "123 Rue Principale",
    city: "Bukavu",
    subscriptionActive: true,
    hospitalCredits: 1,
    ambulatoryCredits: 2,
    profileImage: "https://via.placeholder.com/150",
    lastTreatment: {
      month: "Novembre",
      diagnostic: {
        title: "Infection respiratoire aiguë",
        date: "10/11/2024",
        hospital: "Hôpital Général de Référence",
        details:
          "Le patient a été diagnostiqué avec une infection respiratoire et a reçu un traitement antibiotique.",
      },
      treatment: "Amoxicilline, Paracétamol, Repos recommandé.",
    },
  },
  {
    id: "002",
    name: "Jane Smith",
    age: 29,
    address: "456 Avenue de la Paix",
    city: "Goma",
    subscriptionActive: false,
    hospitalCredits: 0,
    ambulatoryCredits: 0,
    profileImage: "https://via.placeholder.com/150",
    lastTreatment: {
      month: "Octobre",
      diagnostic: {
        title: "Paludisme sévère",
        date: "15/10/2024",
        hospital: "Centre de Santé Mont Carmel",
        details:
          "La patiente a été traitée pour un cas de paludisme sévère nécessitant une hospitalisation.",
      },
      treatment: "Artéméther-Luméfantrine, Hydratation IV.",
    },
  },
  {
    id: "003",
    name: "Michael Brown",
    age: 41,
    address: "789 Boulevard des Nations",
    city: "Uvira",
    subscriptionActive: true,
    hospitalCredits: 2,
    ambulatoryCredits: 1,
    profileImage: "https://via.placeholder.com/150",
    lastTreatment: {
      month: "Septembre",
      diagnostic: {
        title: "Hypertension artérielle",
        date: "20/09/2024",
        hospital: "Clinique Bon Samaritain",
        details:
          "Le patient a été diagnostiqué avec une hypertension artérielle et un suivi régulier a été recommandé.",
      },
      treatment: "Antihypertenseurs, Régime pauvre en sel.",
    },
  },
  {
    id: "004",
    name: "Emily White",
    age: 38,
    address: "321 Chemin des Collines",
    city: "Kalehe",
    subscriptionActive: true,
    hospitalCredits: 0,
    ambulatoryCredits: 3,
    profileImage: "https://via.placeholder.com/150",
    lastTreatment: {
      month: "Août",
      diagnostic: {
        title: "Diabète de type 2",
        date: "05/08/2024",
        hospital: "Hôpital Saint Luc",
        details:
          "Le patient est suivi pour un diabète de type 2 et a reçu une prescription pour gérer sa glycémie.",
      },
      treatment: "Metformine, Contrôle glycémique, Consultation diététique.",
    },
  },
  {
    id: "005",
    name: "Daniel Green",
    age: 46,
    address: "654 Route des Lacs",
    city: "Idjwi",
    subscriptionActive: false,
    hospitalCredits: 0,
    ambulatoryCredits: 0,
    profileImage: "https://via.placeholder.com/150",
    lastTreatment: {
      month: "Juillet",
      diagnostic: {
        title: "Douleurs lombaires chroniques",
        date: "25/07/2024",
        hospital: "Centre Médical Idjwi",
        details:
          "Le patient a été traité pour des douleurs lombaires chroniques avec des séances de kinésithérapie.",
      },
      treatment: "Anti-inflammatoires, Kinésithérapie, Exercices.",
    },
  },
  {
    id: "006",
    name: "Alice Johnson",
    age: 32,
    address: "987 Voie des Palmiers",
    city: "Walungu",
    subscriptionActive: true,
    hospitalCredits: 1,
    ambulatoryCredits: 3,
    profileImage: "https://via.placeholder.com/150",
    lastTreatment: {
      month: "Décembre",
      diagnostic: {
        title: "Anémie sévère",
        date: "01/12/2024",
        hospital: "Hôpital de Walungu",
        details:
          "La patiente a reçu une transfusion sanguine pour traiter une anémie sévère.",
      },
      treatment:
        "Transfusion sanguine, Suppléments en fer, Régime alimentaire enrichi.",
    },
  },
  {
    id: "007",
    name: "Robert Davis",
    age: 39,
    address: "123 Allée des Baobabs",
    city: "Kabare",
    subscriptionActive: true,
    hospitalCredits: 2,
    ambulatoryCredits: 2,
    profileImage: "https://via.placeholder.com/150",
    lastTreatment: {
      month: "Novembre",
      diagnostic: {
        title: "Fracture du bras droit",
        date: "18/11/2024",
        hospital: "Clinique Kabare",
        details:
          "Le patient a été traité pour une fracture du bras droit avec pose de plâtre.",
      },
      treatment: "Immobilisation, Antalgiques, Suivi orthopédique.",
    },
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState("home"); // Track current view
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

      ndef.onreading = (event) => {
        const { message } = event;
        let detectedId = null;

        for (const record of message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder(record.encoding || "utf-8");
            detectedId = textDecoder.decode(record.data);
          }
        }

        if (detectedId) {
          const user = users.find((u) => u.id === detectedId);
          if (user) {
            setScanResult(user);
          } else {
            alert("Utilisateur introuvable !");
          }
        } else {
          alert("Aucune donnée NFC valide détectée.");
        }

        setIsScanning(false);
      };
    } catch (error) {
      console.error("Erreur lors du scan NFC :", error);
      alert("Une erreur est survenue lors du scan.");
      setIsScanning(false);
    }
  };

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

  const renderUserDetails = (user) => (
    <div className="bg-gray-50 p-6 shadow rounded">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.profileImage}
          alt={`${user.name} profile`}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p>Âge : {user.age}</p>
          <p>
            Adresse : {user.address}, {user.city}
          </p>
          <span
            className={`inline-block px-2 py-1 rounded text-sm ${
              user.subscriptionActive
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {user.subscriptionActive ? "Abonnement Actif" : "Inactif"}
          </span>
        </div>
      </div>
      <hr className="my-4" />
      <p className="font-semibold mb-2">
        Traitement : {user.lastTreatment.month}
      </p>
      <div className="mb-4">
        <p className="text-sm mb-1">Hospitalisation</p>
        <div className="flex justify-between items-center mb-1 text-sm text-gray-700">
          <span>{user.hospitalCredits}/2</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-4">
          <div
            className="bg-blue-500 h-4 rounded"
            style={{ width: `${(user.hospitalCredits / 2) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm mb-1">Soins Ambulatoires</p>
        <div className="flex justify-between items-center mb-1 text-sm text-gray-700">
          <span>{user.ambulatoryCredits}/3</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-4">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${(user.ambulatoryCredits / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Diagnostic</h4>
          <p className="font-medium text-gray-700 mb-1">
            Titre : {user.lastTreatment.diagnostic.title}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Date : {user.lastTreatment.diagnostic.date}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Hôpital/Centre de Santé : {user.lastTreatment.diagnostic.hospital}
          </p>
          <p>{user.lastTreatment.diagnostic.details}</p>
        </div>
        <div>
          <h4 className="font-semibold">Traitement Offert</h4>
          <p>{user.lastTreatment.treatment}</p>
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        onClick={() => handleWrite(user.id)}
      >
        Configurer la Carte
      </button>
      <button
        className="mt-4 ml-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={() => setCurrentPage("home")}
      >
        Retour
      </button>
    </div>
  );

  return (
    <div className="app bg-gray-100 p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Gestion NFC pour la Mutuelle de Santé
      </h1>
      {currentPage === "home" && (
        <div className="member-list bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">Liste des Membres</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center mb-4 border-b pb-2"
              >
                <span>{user.name}</span>
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  onClick={() => {
                    setSelectedUser(user);
                    setCurrentPage("details");
                  }}
                >
                  Détails
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setCurrentPage("scan")}
          >
            Scanner une Carte NFC
          </button>
        </div>
      )}
      {currentPage === "details" &&
        selectedUser &&
        renderUserDetails(selectedUser)}
      {currentPage === "scan" && (
        <div className="scanner bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">Scanner une Carte NFC</h2>
          <button
            onClick={handleScan}
            className={`px-4 py-2 rounded ${
              isScanning
                ? "bg-gray-500 text-white"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {isScanning ? "Scan en cours..." : "Lancer le Scan"}
          </button>
          {scanResult && (
            <div className="mt-4">{renderUserDetails(scanResult)}</div>
          )}

          <button
            className="mt-4 px-4 ml-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setCurrentPage("home")}
          >
            Retour
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
