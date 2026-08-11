import { NextResponse } from 'next/server'

export function internalErrorResponse() {
  return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
}
