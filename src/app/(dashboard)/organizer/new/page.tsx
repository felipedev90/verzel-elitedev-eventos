import { EventForm } from './event-form'

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 font-serif text-3xl text-text">Criar evento</h1>
      <EventForm />
    </div>
  )
}
