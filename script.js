const Modal = {
    open(){
        // Abrir o modal
        // Adiciona a class .active no modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close(){
        // Fechar o modal
        // Remove a class .active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}


const transactions = [
    {
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'
    },
    {
        description: 'Crianção website	',
        amount: 50000,
        date: '23/01/2021'
    },
    {
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021'
    },
    {
        description: 'App',
        amount: 20000,
        date: '23/01/2021'
    }
]

const Transaction = {
    all: transactions,

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0){
                income += transaction.amount
            }
        })
        return income
    },

    expenses(){
        let expense = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0){
                expense += transaction.amount
            }
        })
        return expense
    },

    total(){
        return Transaction.incomes() + Transaction.expenses()
    }
}

const Utils = {
    // Formatando o valor recebido para uma apresentação em moeda real
    // OBS: o valor recebi é recebido sem ponto ou vírgula para separar os centavos
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        // Usando RegEx e achando tudo que não é um numero e trocando por vazio
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

       return signal + value
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    /* Retorna um html com os valores do objTransaction passado como parâmetro.
    Uma tag <tr> de transação será preenchida com esse retorno.*/
    innerHTMLTransaction(objTransaction){

        /* Confere se o valor é negativo ou positivo para aplicar a class
        adequada no <td> do amount (valor)*/
        const CSSclass = objTransaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(objTransaction.amount)
        
        const htmlNewTransaction = `
            <td class="description">${objTransaction.description}</td>
            <td class=${CSSclass}>${amount}</td>
            <td class="date">${objTransaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>`

        return htmlNewTransaction
    },
    
    /* Cria uma novo <tr>, preenche ele com a função innetHTMLTransaction
     e depois coloca o <tr> dentro do container das transações(<tbody>). */
    addTransaction(objTransaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(objTransaction)

        DOM.transactionsContainer.appendChild(tr)
    },

    updateBalance(){
        document.querySelector('#incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes());

        document.querySelector('#expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses());

        document.querySelector('#totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
            
    },

    formatData(){

    },
    validateFields(){
        const {description, amount, date} = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Um dos campos não foi preenchido. Por favor, preencha todos.")
        }
    },

    submit(event){
        event.preventDefault()

        
    }
}

const App = {
    init(){
        /* Preenchendo o container de transações com cada uma das transações do 
        array transactions.*/
        Transaction.all.forEach((transation) => DOM.addTransaction(transation))
        
        DOM.updateBalance()

    },

    reload(){
        DOM.clearTransactions()
        App.init()
    }
    
}

App.init()
