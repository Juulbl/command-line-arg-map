module.exports = function(value) {
    /**
     * @brief Get argument from command.
     * @param arg Supports multiple flags as input. Example (-s, --source).
     * @returns Value of the given argument.
     */
    this.getArg = function(arg) {
        if(arguments.length > 1) {
            for(let i = 0; i < arguments.length; i++) {
                let argContent = this.getArg(arguments[i]);
                if(argContent !== undefined) {
                    return argContent;
                }
            }
        } else {
            return this.command.args[arg];
        }
        return undefined;
    }

    /**
     * @brief Get arguments from command.
     * @param arguments Uses all given arguments. If no arguments are given, it will return all command arguments.
     * @returns Arguments map with their values.
     */
    this.getArgs = function() {
        //If no arguments given, return all arguments.
        if(arguments.length == 0) {
            return this.command.args;
        }

        let args = {};
        for(let i = 0; i < arguments.length; i++) {
            let argContent = this.command.args[arguments[i]];
            args[arguments[i]] = argContent;
        }
        return args;
    }

    /**
     * @brief returns all given commands.
     */
    this.getCommands = function() {
        return this.command.commands;
    }

    /**
     * @brief Splits the text at space character when not within quotes.
     * @param text Text.
     * @returns Array containing all text pieces.
     */
    this.splitText = function(text) {
        let arr = [];
        let currText = '';
        let lastChar = '';
        let isInWithinQuotes = null;

        for(let i = 0; i < text.length; i++) {
            let currChar = text[i];

            switch(currChar) {
                case ' ':
                    if(isInWithinQuotes !== null) {
                        currText += currChar;
                    } else {
                        arr.push(currText);
                        currText = '';
                    }
                    break;
                case '"':
                    if(lastChar !== '\\' && isInWithinQuotes === '"') {
                        isInWithinQuotes = null;
                        arr.push(currText);
                        currText = '';
                    } else if(isInWithinQuotes == null) {
                        isInWithinQuotes = currChar;
                    } else {
                        currText += currChar;
                    }
                    break;
                case '\'':
                    if(lastChar !== '\\' && isInWithinQuotes === '\'') {
                        isInWithinQuotes = null;
                        arr.push(currText);
                        currText = '';
                    } else if(isInWithinQuotes == null) {
                        isInWithinQuotes = currChar;
                    } else {
                        currText += currChar;
                    }
                    break;
                case '\\':
                    break;
                default:
                    currText += currChar;
                    break;
            }
            lastChar = currChar;
        }

        if(currText.length > 0) {
            arr.push(currText);
        }

        return arr;
    }

    /**
     * @brief Converts an array or piece of text to a command object.
     * @param value Value. This can be an array or string.
     * @returns Command.
     */
    this.toCommand = function(value) {
        let command = {commands: [], args: {}};

        if(value == null) {
            return command;
        }

        let splitResult = Array.isArray(value)? value : this.splitText(value);
        
        let isAtCommand = true;
        let lastAddedArg = null;
        for(let i = 0; i < splitResult.length; i++) {

            let item = splitResult[i];

            if(item.substring(0, 2) === '--') {

                isAtCommand = false;
                lastAddedArg = null;

                let splitWord = item.split('=');
                if(splitWord.length > 1) {
                    command.args[splitWord[0]] = splitWord[1];
                } else {
                    command.args[splitWord[0]] = null;
                    lastAddedArg = splitWord[0];
                }

            } else if(item[0] === '-') {

                isAtCommand = false;

                command.args[item] = null;
                lastAddedArg = item;

            } else if(isAtCommand) {

                command.commands.push(item);

            } else if(lastAddedArg != null) {

                if(command.args[lastAddedArg] == null) {
                    command.args[lastAddedArg] = item;
                    continue;
                } else if(!Array.isArray(command.args[lastAddedArg])) {
                    command.args[lastAddedArg] = [command.args[lastAddedArg]];
                }
                command.args[lastAddedArg].push(item);

            }
        }
        
        return command;
    }

    //Overwrite to string function.
    this.toString = () => {
        return JSON.stringify(this.command);
    }

    //Constructor.
    this.command = this.toCommand((value != null)? value : null);
};