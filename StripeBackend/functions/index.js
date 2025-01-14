const {onRequest} = require("firebase-functions/v2/https");

// Importer le Secret Manager
const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();

// Importer Firebase Admin et Firestore
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.getPaymentIntent = onRequest(async (req, res) => {
  const price = req.query.price;
  const currency = req.query.currency;
  const productID = req.query.productID;

  if (!price || !currency || !productID) {
    return res
        .status(400)
        .send("Invalid Request.You must send a price,currency,and productID.");
  }
  if (currency !== "eur") {
    return res.status(400).send("Invalid Request. Currency must be Euro.");
  }

  // Accéder au secret depuis Google Secret Manager
  const [accessResponse] = await client.accessSecretVersion({
    name: "projects/640590726846/secrets/stripe-secret-key/versions/latest",
  });
  const responsePayload = accessResponse.payload.data.toString("utf8");

  // Initialiser Stripe avec la clé secrète
  const stripe = require("stripe")(responsePayload);

  try {
    // Créer une clé éphémère (ephemeralKey) et un PaymentIntent
    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: "cus_RaP2WRVW7OVh9a"},
        {apiVersion: "2024-06-20"},
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: currency,
      customer: "cus_RaP2WRVW7OVh9a",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {productID},
    });

    // Réponse JSON avec les clés nécessaires pour le paiement
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: "cus_RaP2WRVW7OVh9a",
      displayName: "Doofenshmirtz Evil Inc.",
    });
  } catch (error) {
    res
        .status(500)
        .send("An error has occurred while generating the payment intent.");
  }
});

exports.getEphemeralSecret = onRequest(async (req, res) => {
  // Accéder au secret depuis Google Secret Manager
  const [accessResponse] = await client.accessSecretVersion({
    name: "projects/640590726846/secrets/stripe-secret-key/versions/latest",
  });
  const responsePayload = accessResponse.payload.data.toString("utf8");

  const stripe = require("stripe")(responsePayload);
  try {
    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: "cus_RaP2WRVW7OVh9a"},
        {apiVersion: "2024-06-20"},
    );

    res.json({
      ephemeralKey: ephemeralKey.secret,
      customer: "cus_RaP2WRVW7OVh9a",
    });
  } catch (error) {
    res
        .status(500)
        .send("An error occurred while generating the ephemeral key.");
  }
});

exports.savePaymentToDatabase = onRequest(async (req, res) => {
  if (!req.body) res.status(400).send("POST Request with body expected");
  // Access the secret.
  const [accessResponse] = await client.accessSecretVersion({
    name: "projects/640590726846/secrets/stripe-secret-key/versions/latest",
  });
  const responsePayload = accessResponse.payload.data.toString("utf8");
  const stripe = require("stripe")(responsePayload);
  // Access the secret.
  const webhookSignature = await client.accessSecretVersion({
    name: "projects/640590726846/secrets"+
    "/savePaymentToDBWebhookKey/versions/latest",
  });
  const endpointSecret = webhookSignature[0].payload.data.toString("utf8");
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    // eslint-disable-next-line no-unused-vars
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
  const db = getFirestore();
  try {
    await db.collection("purchases").add({
      productID: req.body.data.object.metadata.productID,
      timestamp: req.body.created,
      price: req.body.data.object.amount,
    });
  } catch (e) {
    console.log(e);
  }
  res.send("Success");
});
