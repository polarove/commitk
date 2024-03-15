import CLI from 'clui'

export const loading = (description: string = 'Loading...') =>
	new CLI.Spinner(description)
