# RuralDiag

An AI-powered diagnostic assistant designed to help ASHA workers in rural India make better healthcare decisions.

🌐 **Live Application:** https://main.dfvpma65yi8v4.amplifyapp.com

🔗 **Backend API:** https://p6v39w1oah.execute-api.ap-south-1.amazonaws.com/prod

---

## About the Project

During my research into rural healthcare challenges in India, I learned that ASHA workers visit over 1000 homes monthly but lack basic diagnostic tools. They write symptoms on paper with no way to identify emergencies or track health patterns across villages.

RuralDiag aims to solve this by providing an offline-capable mobile application that uses AI to analyze symptoms, calculate severity scores, and automatically alert doctors when critical cases are detected.

## Key Features

- **Offline-First Architecture** - Works without internet connectivity, syncs data when connection is available
- **AI-Powered Diagnosis** - Uses AWS Bedrock (Claude) to analyze symptoms and suggest possible conditions
- **Automatic Risk Assessment** - Calculates severity scores and triggers SMS alerts for critical cases
- **Multi-Language Support** - Interface available in Hindi and English
- **Village-Level Analytics** - Track health patterns and identify potential outbreaks early
- **Patient History Tracking** - Maintain complete medical records for follow-up care

## Tech Stack

### Backend
- **AWS Lambda** - Serverless compute for all business logic
- **AWS API Gateway** - RESTful API endpoints
- **Amazon DynamoDB** - NoSQL database for patient records and diagnoses
- **Amazon S3** - Storage for medical images and documents
- **Amazon SNS** - Push notifications for emergency alerts
- **AWS Bedrock** - AI/ML service for diagnostic suggestions

### Frontend
- **Next.js 14** - React framework with App Router
- **CSS Modules** - Component-scoped styling
- **Progressive Web App** - Installable on mobile devices with offline support

## Architecture

```
Mobile/Desktop Client (Next.js PWA)
           ↓
    API Gateway (REST)
           ↓
    ┌──────┴───────┬────────────┬─────────┬──────────┐
    ↓              ↓            ↓         ↓          ↓
Diagnosis      Severity     Alerts    Sync    Analytics
Lambda         Lambda       Lambda   Lambda    Lambda
    ↓              ↓            ↓         ↓          ↓
    └──────┬───────┴────────────┴─────────┴──────────┘
           ↓
   DynamoDB + S3 + SNS
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- AWS Account
- AWS CLI configured with credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/Krishna-Tripathi78/Rular-Diag.git
cd Rular-Diag
```

2. Deploy the backend
```bash
cd backend
sam build
sam deploy --guided
```

During deployment, you'll be asked:
- Stack name: `ruraldiag-stack`
- Region: `ap-south-1` (or your preference)
- Confirm changes before deploy: Yes
- Allow SAM CLI IAM role creation: Yes

3. Set up the frontend
```bash
cd ../frontend
npm install
cp .env.example .env.local
```

4. Update `.env.local` with your API Gateway URL from the SAM deployment output
```
NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod
```

5. Run the development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/diagnose` | POST | Get AI diagnosis from symptoms |
| `/severity` | POST | Calculate patient severity score (0-10) |
| `/sync` | POST | Sync offline patient data to cloud |
| `/alerts` | POST | Send emergency alerts via SNS |
| `/analytics` | GET | Retrieve village health analytics |

## Current Deployment

The application is fully deployed on AWS:

**Frontend (AWS Amplify):**
- **URL:** https://main.dfvpma65yi8v4.amplifyapp.com
- **Hosting:** AWS Amplify with automatic CI/CD
- **Status:** ✅ Active

**Backend (Serverless):**
- **Stack:** ruraldiag-stack
- **Region:** ap-south-1 (Mumbai)
- **API Gateway:** https://p6v39w1oah.execute-api.ap-south-1.amazonaws.com/prod
- **Status:** ✅ Active

**Resources:**
- 5 Lambda functions (Node.js 18.x runtime)
- 2 DynamoDB tables (RuralDiag-Patients, RuralDiag-Diagnoses)
- 1 S3 bucket for patient data
- 1 SNS topic for emergency alerts
- Amplify Hosting with global CDN

## Project Structure

```
RuralDiag/
├── backend/
│   ├── functions/
│   │   ├── diagnosis/       # AI diagnosis logic
│   │   ├── severity/        # Risk scoring algorithm
│   │   ├── alerts/          # SNS notification handler
│   │   ├── sync/            # Offline data sync
│   │   └── analytics/       # Health data queries
│   ├── template.yaml        # SAM infrastructure definition
│   └── samconfig.toml       # Deployment configuration
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/       # Patient list view
│   │   ├── visit/           # New patient visit form
│   │   ├── patient/[id]/    # Patient details page
│   │   ├── analytics/       # District health dashboard
│   │   └── lib/api.js       # API client with offline queue
│   └── package.json
│
└── README.md
```

## Usage Example

1. ASHA worker visits a patient with fever and cough
2. Opens RuralDiag app and enters symptoms (works offline)
3. AI analyzes symptoms and suggests possible conditions (e.g., flu, malaria, dengue)
4. System calculates severity score
5. If severity > 8/10, automatic SMS alert sent to nearest PHC doctor
6. Patient record saved locally, syncs to cloud when internet available
7. District admin can see aggregated data in analytics dashboard

## Challenges Faced

- Implementing robust offline functionality with service workers
- Optimizing Lambda cold start times for better performance
- Designing a severity scoring algorithm that balances sensitivity and specificity
- Handling multi-language content without external translation APIs
- Managing AWS free tier limits while testing

## Future Improvements

- Integration with government health systems (HMIS, RCH portal)
- Voice input in regional languages using AWS Transcribe
- Image recognition for visible symptoms using AWS Rekognition
- WhatsApp bot integration for broader reach
- Telemedicine video consultation feature
- Machine learning model trained on rural Indian health data

## Cost Analysis

Currently running entirely within AWS Free Tier:
- Lambda: 1M requests/month free (using ~50K)
- API Gateway: 1M API calls/month free
- DynamoDB: 25GB storage free
- S3: 5GB storage free
- SNS: 1,000 notifications/month free

Estimated cost after free tier: ~$5-10/month for moderate usage

## Contributing

This is an academic project, but suggestions and improvements are welcome! Feel free to open an issue or submit a pull request.

## License

MIT License - feel free to use this code for educational purposes.

## Acknowledgments

- Inspired by conversations with ASHA workers in rural Uttar Pradesh
- Built for the AWS Hackathon 2026
- Thanks to AWS for providing free tier services that made this possible

---

**Contact:** [Krishna Tripathi](https://github.com/Krishna-Tripathi78)
