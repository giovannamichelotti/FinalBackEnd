class ValidationHelper {
    static verifyString = (field, value, minLen) => {
        value = this.clearString(value)
        if ( !(typeof(value) === 'string') ) {
            throw new Error( `${field} debe ser un texto`, { code: 'INVALID_STRING' } );
        }
        if (minLen) {
            this.verifyMinLength(field, value, minLen)
        }
    }
    static verifyMinLength = (field, value, minLen) => {
        if (!value) {
            throw new Error( `${field} no puede ser vacio` );
        }
        if ( !(value.length >= minLen) ) {
            throw new Error( `${field} debe tener al menos ${minLen} caracteres`, { code: 'INVALID_MIN_LEN' } );
        }
    }
    static isNumber = (field, value) => {
        value = parseInt(value)
        if ( !(typeof value === 'number') ) {
            throw new Error( `${field} no es un número`, { code: 'INVALID_NUMBER' } );
        }
    
        return true;
    }
    static isEmail = (field, value) => {
        value = this.clearEmail(value)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if ( !(emailRegex.test(value)) ) {
            throw new Error( `El ${field} no es válido`, { code: 'INVALID_EMAIL' } );
        }
    
        return true;
    }
    static clearString(value) {
        if (typeof value !== 'string') {
            return '';
        } 
        return value
            .replace(/&/g, 'y')
            .replace(/</g, '')
            .replace(/>/g, '')
            .replace(/"/g, '')
            .replace(/'/g, '');
    }
    static clearEmail(email) {
        if (typeof email !== 'string') {
            return '';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim()) ? email.trim() : '';
    }
}

export default ValidationHelper