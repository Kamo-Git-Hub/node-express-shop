M.Tabs.init(document.querySelectorAll('.tabs'))

function toCurency (price){
    return new Intl.NumberFormat('us-US', {
        currency: "usd",
        style: "currency"
    }).format(price)
    }
    
    document.querySelectorAll('.price').forEach(elem => {
        elem.textContent = toCurency(elem.textContent)
    })
    
    
    const $cart = document.querySelector('#cart')
    
    if ($cart) {
        $cart.addEventListener('click', event => {
            if (event.target.classList.contains('js-remove')) {
                const id = event.target.dataset.id
                fetch('/cart/remove/' + id, {
                    method: "delete",
                }).then(res => res.json())
                    .then(cart => {
                        if (cart.courses.length) {
                            const html = cart.courses.map(c => {
                                return `
                            <tr>
            <td>${c.title}</td>
            <td>${c.count}</td>
            <td>
                <button class="btn btn-small red js-remove" data-id="${c._id}">delete</button>
            </td>
        </tr>
                            `
                            }).join('')
                            $cart.querySelector('tbody').innerHTML =html
                            $cart.querySelector('.price').textContent =toCurency(cart.price)
                        } else {
                            $cart.innerHTML = `<h3>Cart is ampty</h3>`
                        }
                    })
            }
        })
    }
