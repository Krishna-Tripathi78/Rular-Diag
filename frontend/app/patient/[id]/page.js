import PatientDetailsClient from './PatientDetailsClient'

export function generateStaticParams() {
    return [{ id: 'default' }]
}

export default function PatientDetails({ params }) {
    return <PatientDetailsClient id={params.id} />
}
