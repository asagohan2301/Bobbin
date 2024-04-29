import { ExclamationTriangle } from 'react-bootstrap-icons'

type errorMessageProps = {
  errorMessages: string[]
}

export default function ErrorMessage(props: errorMessageProps) {
  const { errorMessages } = props
  return (
    <ul className="mt-4 inline-block border border-red-500 px-3 py-2">
      {errorMessages.map((errorMessage, index) => {
        return (
          <li key={index} className="mb-1 flex text-red-500">
            <ExclamationTriangle className="mr-1 size-[20px]" />
            <p>{errorMessage}</p>
          </li>
        )
      })}
    </ul>
  )
}
