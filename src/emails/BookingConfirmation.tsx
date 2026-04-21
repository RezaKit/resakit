import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface BookingConfirmationProps {
  organizerName: string
  bookingRef: string
  experienceName: string
  providerName: string
  date: string
  groupSize: number
  totalAmount: number
  splitPaymentUrl?: string
  appUrl: string
}

export default function BookingConfirmation({
  organizerName = 'Sophie',
  bookingRef = 'RK-XXXXXXXX',
  experienceName = 'Escape Room Mystery',
  providerName = 'Enigma Toulouse',
  date = new Date().toISOString(),
  groupSize = 10,
  totalAmount = 250,
  splitPaymentUrl,
  appUrl = 'https://resakit.fr',
}: BookingConfirmationProps) {
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Html>
      <Head />
      <Preview>Votre réservation {bookingRef} est confirmée !</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ResaKit</Heading>
          </Section>

          <Section style={heroSection}>
            <Text style={checkmark}>✅</Text>
            <Heading style={h1}>Réservation confirmée !</Heading>
            <Text style={ref}>Référence : {bookingRef}</Text>
          </Section>

          <Section style={card}>
            <Text style={greeting}>Bonjour {organizerName},</Text>
            <Text style={paragraph}>
              Merci pour votre réservation ! Voici le récapitulatif :
            </Text>

            <Hr style={hr} />

            <div style={infoRow}>
              <Text style={label}>Expérience</Text>
              <Text style={value}>{experienceName}</Text>
            </div>
            <div style={infoRow}>
              <Text style={label}>Prestataire</Text>
              <Text style={value}>{providerName}</Text>
            </div>
            <div style={infoRow}>
              <Text style={label}>Date</Text>
              <Text style={value}>{formattedDate}</Text>
            </div>
            <div style={infoRow}>
              <Text style={label}>Nombre de personnes</Text>
              <Text style={value}>{groupSize}</Text>
            </div>
            <div style={infoRow}>
              <Text style={label}>Montant total</Text>
              <Text style={valueBold}>{totalAmount.toFixed(2)} €</Text>
            </div>
          </Section>

          {splitPaymentUrl && (
            <Section style={splitCard}>
              <Heading style={h2}>🎉 Partagez avec votre groupe</Heading>
              <Text style={paragraph}>
                Chaque participant peut maintenant payer sa part via ce lien unique :
              </Text>
              <Button style={button} href={splitPaymentUrl}>
                Voir le lien de paiement
              </Button>
              <Text style={smallText}>
                Partagez ce lien sur WhatsApp, Signal, ou par email :
                <br />
                <Link href={splitPaymentUrl} style={link}>
                  {splitPaymentUrl}
                </Link>
              </Text>
            </Section>
          )}

          <Section style={footer}>
            <Text style={footerText}>
              Des questions ? Répondez directement à cet email.
              <br />
              <Link href={appUrl} style={link}>
                resakit.fr
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif',
}
const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
}
const header = {
  padding: '20px 30px',
  borderBottom: '1px solid #e6ebf1',
}
const logo = {
  color: '#7C3AED',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: 0,
}
const heroSection = {
  padding: '40px 30px',
  textAlign: 'center' as const,
  backgroundColor: '#ffffff',
}
const checkmark = {
  fontSize: '48px',
  margin: '0 0 20px 0',
}
const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}
const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
}
const ref = {
  color: '#6b7280',
  fontSize: '14px',
  margin: 0,
}
const card = {
  backgroundColor: '#ffffff',
  padding: '30px',
  margin: '0 0 20px 0',
}
const greeting = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 10px 0',
}
const paragraph = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
}
const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}
const infoRow = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
}
const label = {
  color: '#6b7280',
  fontSize: '14px',
  margin: 0,
}
const value = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '500',
  margin: 0,
}
const valueBold = {
  color: '#7C3AED',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: 0,
}
const splitCard = {
  backgroundColor: '#faf5ff',
  border: '2px solid #e9d5ff',
  borderRadius: '12px',
  padding: '30px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}
const button = {
  backgroundColor: '#7C3AED',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  margin: '15px 0',
}
const smallText = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '15px 0 0 0',
}
const link = {
  color: '#7C3AED',
  textDecoration: 'underline',
}
const footer = {
  padding: '20px 30px',
  textAlign: 'center' as const,
}
const footerText = {
  color: '#8898aa',
  fontSize: '13px',
  lineHeight: '20px',
  margin: 0,
}
