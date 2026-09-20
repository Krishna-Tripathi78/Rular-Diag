# RuralDiag

AI diagnostic tool for ASHA workers serving rural India.

## 🚀 Live Deployment

**Backend API:** [`https://p6v39w1oah.execute-api.ap-south-1.amazonaws.com/prod`](https://p6v39w1oah.execute-api.ap-south-1.amazonaws.com/prod)

**Status:** ✅ Deployed on AWS (API Gateway + Lambda + DynamoDB + S3 + SNS)

---

## The Problem

ASHA workers visit over 1000 homes each month in villages across India. Right now, they write symptoms on paper, have no way to detect emergencies, and district officials can't see what's happening on the ground. When someone gets seriously sick, it's often too late by the time they reach a hospital.

We spent time talking to ASHA workers in Uttar Pradesh. They told us their biggest challenge isn't lack of dedication - it's lack of tools. They need something that works offline, speaks their language, and helps them make better decisions in the field.

## What We Built

RuralDiag gives ASHA workers an AI assistant that runs on their phones. Type in symptoms, get diagnostic suggestions powered by AWS Bedrock, and automatically alert doctors when something looks serious. Everything syncs when internet is available, and district officials get a dashboard showing health trends across villages.

This isn't about replacing doctors. It's about giving frontline workers the support they need to save lives.

## Why This Matters

MaatriSahayak focuses on urban emergency response. Government's RCH portal tracks data but doesn't analyze it. Telemedicine apps like Practo don't work in areas with spotty internet. 

RuralDiag is different - it's built specifically for rural health workers who need offline support, multilingual interfaces, and AI that understands the context of village-level healthcare.

## How It Works

ASHA worker opens the app and enters patient symptoms. The data goes to AWS Lambda which talks to Bedrock (Claude) for analysis. Lambda calculates a severity score - if it's high risk, SNS fires off an alert to the nearest PHC doctor. All patient data gets stored in DynamoDB, files go to S3, and QuickSight pulls everything together for district dashboards.

Works offline first. Data syncs automatically when connection returns.

## Tech Stack

**Frontend:** React PWA with offline support, Material-UI for components, i18next for Hindi/Telugu/Bengali/Tamil translations

**Backend:** AWS Bedrock for AI diagnosis, Lambda for compute, DynamoDB for patient records, SNS for doctor alerts, S3 for file storage, QuickSight for analytics dashboards

**Why this stack:** PWA works offline which is critical for rural areas. AWS services scale automatically and Bedrock gives us access to Claude without managing ML infrastructure.

## Core Features

**Smart symptom input** - Voice recording in local languages, photo uploads for visible conditions, guided questions that adapt based on previous answers

**AI diagnosis** - Bedrock analyzes symptoms against medical knowledge, returns probable conditions with confidence levels, factors in patient history and demographics

**Risk scoring** - Automatic calculation based on symptom severity, age, pre-existing conditions. Critical cases trigger immediate doctor alerts via SMS

**Village health tracking** - See all patients in a village, spot disease patterns early (like multiple fever cases suggesting outbreak), track vaccination status

**District dashboard** - Real-time disease surveillance, identify villages needing resources, measure ASHA performance, early warning for epidemics

## Real Scenarios

**Scenario 1:** Seven-year-old with 102°F fever and rash. ASHA worker inputs symptoms, AI suggests possible measles, severity marked high. PHC doctor gets alert within seconds, advises immediate clinic visit. Kid gets treatment same day instead of waiting until it's critical.

**Scenario 2:** Pregnant woman in month 7 reports severe headache and swollen feet. System flags potential pre-eclampsia based on symptoms plus her previous high BP history. Critical alert sent, ambulance dispatched, woman transferred to district hospital. Caught early enough to prevent complications.

**Scenario 3:** QuickSight shows 15 fever cases in one village over 7 days. Pattern recognition suggests dengue outbreak. District officer sees the alert, deploys fumigation team and medical camp. Outbreak contained before spreading to neighboring villages.

## Getting Started

### Prerequisites
- Node.js 18+
- AWS Account with appropriate permissions
- AWS CLI configured

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Krishna-Tripathi78/Rular-Diag.git
cd RularDiag
```

### Backend Setup (AWS SAM)

```bash
# Navigate to backend
cd backend

# Build and deploy using AWS SAM
sam build
sam deploy --guided

# Note: First deployment will prompt for configuration
# Stack name: ruraldiag-stack
# Region: ap-south-1 (or your preferred region)
```

The deployment will create:
- 5 Lambda functions (Diagnosis, Severity, Alerts, Sync, Analytics)
- DynamoDB tables (Patients, Diagnoses)
- S3 bucket for patient data
- SNS topic for emergency alerts
- API Gateway endpoint

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your deployed API Gateway URL to .env.local
# NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Project Structure

```
ruraldiag/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SymptomInput.jsx
│   │   │   ├── DiagnosisCard.jsx
│   │   │   └── VillageMap.jsx
│   │   ├── pages/
│   │   │   ├── AshaWorkerDashboard.jsx
│   │   │   ├── PatientDetails.jsx
│   │   │   └── DistrictAnalytics.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── offlineSync.js
│   │   ├── i18n/
│   │   │   ├── hi.json
│   │   │   ├── te.json
│   │   │   └── bn.json
│   │   └── utils/
│   │       ├── severityCalculator.js
│   │       └── localDB.js
│   ├── public/
│   │   ├── manifest.json
│   │   └── sw.js
│   └── package.json
│
├── backend/
│   ├── functions/
│   │   ├── diagnosis/
│   │   │   ├── handler.js
│   │   │   └── bedrockClient.js
│   │   ├── severity/
│   │   │   ├── handler.js
│   │   │   └── scoreLogic.js
│   │   ├── alerts/
│   │   │   ├── handler.js
│   │   │   └── snsClient.js
│   │   └── sync/
│   │       ├── handler.js
│   │       └── dynamoClient.js
│   └── package.json
│
├── infrastructure/
│   ├── lib/
│   │   ├── lambda-stack.js
│   │   ├── dynamodb-stack.js
│   │   ├── sns-stack.js
│   │   └── s3-stack.js
│   ├── bin/
│   │   └── app.js
│   └── package.json
│
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
│
└── tests/
    ├── unit/
    └── integration/
```

## What's Next

Right now this is a hackathon prototype. To make it production-ready, we need:

- Integration with existing government health systems
- Field testing with actual ASHA workers
- Medical expert validation of AI suggestions
- Proper security audit and compliance review
- Scale testing across multiple districts

But the core idea works. We've proven that AI can support rural health workers, and the AWS infrastructure can handle it.

## Built With

**Backend:**
- AWS Lambda (Node.js 18.x)
- AWS API Gateway
- Amazon DynamoDB
- Amazon S3
- Amazon SNS
- AWS Bedrock (Claude AI)
- AWS SAM (Serverless Application Model)

**Frontend:**
- Next.js 14 (App Router)
- React 18
- CSS Modules
- Lucide Icons

## Deployment Details

**Current Stack:**
- Stack Name: `ruraldiag-stack`
- Region: `ap-south-1` (Mumbai)
- Status: `CREATE_COMPLETE`
- Deployment Date: September 20, 2026

**Resources:**
- API Gateway: `https://p6v39w1oah.execute-api.ap-south-1.amazonaws.com/prod`
- DynamoDB Tables: `RuralDiag-Patients`, `RuralDiag-Diagnoses`
- S3 Bucket: `ruraldiag-patient-data-053549819347`
- SNS Topic: `RuralDiag-Alerts`

## API Endpoints

- `POST /diagnose` - AI-powered symptom diagnosis
- `POST /severity` - Calculate patient severity score
- `POST /sync` - Sync offline patient data
- `POST /alerts` - Trigger emergency alerts
- `GET /analytics` - Retrieve health analytics data

## License

MIT

---

*Made for rural health workers who deserve better tools* 
