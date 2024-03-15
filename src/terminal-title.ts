import { log } from 'console'
import figlet from 'figlet'
import type { ChalkInstance } from 'chalk'

const useTerminalTitle = (title: string, color: ChalkInstance) =>
	log(color(figlet.textSync(title, { horizontalLayout: 'full' })))

export default useTerminalTitle
