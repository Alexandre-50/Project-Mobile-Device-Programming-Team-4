const {onRequest} = require("firebase-functions/v2/https");
const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();
const {initializeApp} = require("firebase-admin/app");

initializeApp();

let stripe; // Déclaration globale pour Stripe

// Fonction pour récupérer la clé Stripe de manière centralisée
const getStripeClient = async () => {
  if (!stripe) {
    try {
      const [accessResponse] = await client.accessSecretVersion({
        name: "projects/640590726846/secrets/stripe-secret-key/versions/latest",
      });
      const responsePayload=accessResponse.payload.data.toString("utf8").trim();
      console.log("Clé Stripe récupérée avec succès.");
      stripe = require("stripe")(responsePayload); // Initialisation unique
    } catch (error) {
      console.error("Erreur lors de l'accès au Secret Manager:", error);
      throw new Error("Impossible de récupérer la clé Stripe.");
    }
  }
  return stripe;
};

exports.getPaymentIntent = onRequest(async (req, res) => {
  const {price, currency, productID, customerId} = req.body;

  if (!price || !currency || !productID || !customerId) {
    return res.status(400).send("Requête invalide. Paramètres manquants.");
  }

  if (currency !== "eur") {
    return res.status(400).send("Devise non supportée.");
  }

  try {
    const stripe = await getStripeClient();

    // Créer une clé éphémère pour le client spécifique
    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: customerId},
        {apiVersion: "2024-06-20"},
    );
    console.log("Ephemeral key créée avec succès : ", ephemeralKey.id);

    // Créer un PaymentIntent pour ce client
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Convertir en centimes
      currency: currency,
      customer: customerId,
      automatic_payment_methods: {enabled: true},
      metadata: {productID},
    });
    console.log("PaymentIntent créé avec succès : ", paymentIntent.id);

    if (!paymentIntent.client_secret || !ephemeralKey.secret) {
      console.error("Données manquantes dans la réponse Stripe.");
      return res.status(500).send("Erreur : Données Stripe manquantes.");
    }

    // Retourner les informations nécessaires au frontend
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
    });
    console.log("Données de paiement envoyées avec succès !");
  } catch (error) {
    console.error("Erreur lors de la création du PaymentIntent :", error);
    res.status(500).send(`Erreur : ${error.message}`);
  }
});

exports.createStripeCustomer = onRequest(async (req, res) => {
  const {email, name, address} = req.body;

  if (!email || !name) {
    return res.status(400).send("Paramètres manquants : email et nom requis.");
  }

  try {
    const stripe = await getStripeClient();

    // Création d'un client Stripe
    const customer = await stripe.customers.create({
      email,
      name,
      address,
    });

    console.log("Client Stripe créé avec succès :", customer.id);

    // Retourner l'ID du client Stripe au frontend
    res.status(200).send({customerId: customer.id});
  } catch (error) {
    console.error("Erreur lors de la création du client Stripe :", error);
    res.status(500).send("Erreur lors de la création du client Stripe.");
  }
});

// exports.getEphemeralSecret = onRequest(async (req, res) => {
//   try {
//     const stripe = await getStripeClient();
//     const ephemeralKey = await stripe.ephemeralKeys.create(
//         {customer: "cus_RaP2WRVW7OVh9a"},
//         {apiVersion: "2024-06-20"},
//     );

//     res.json({
//       ephemeralKey: ephemeralKey.secret,
//       customer: "cus_RaP2WRVW7OVh9a",
//     });
//   } catch (error) {
//     res.status(500).send("Erreur lors de la génération de la clé éphémère.");
//   }
// });

// exports.savePaymentToDatabase = onRequest(async (req, res) => {
//   if (!req.body) {
//     return res.status(400).send("Requête POST attendue
//  avec un corps valide.");
//   }

//   try {
//     const db = getFirestore();
//     await db.collection("purchases").add({
//       productID: req.body.data.object.metadata.productID,
//       timestamp: new Date(req.body.created * 1000),
//       price: req.body.data.object.amount,
//     });
//     res.send("Enregistrement réussi.");
//   } catch (error) {
//     console.error("Erreur lors de l'enregistrement dans la BDD:", error);
//     res.status(500).send("Erreur lors de l'enregistrement.");
//   }
// });
