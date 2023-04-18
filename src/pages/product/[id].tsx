import { stripe } from "@/lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Stripe from "stripe"
import axios from "axios"
import { useState } from "react"
import Head from "next/head"

interface ProductProps {
    product: {
        id: string;
        name: string;
        imageUrl: string;
        price: string;
        description: string;
        defaultPriceId: string;
    }
}

export default function Product({ product }: ProductProps) {
    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
    async function handleBuyProduct() {

        try {
            setIsCreatingCheckoutSession(true)
            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId,
            })

            const { checkoutUrl } = response.data;

            window.location.href = checkoutUrl // Pois e uma url externa, do contrario, usar useRouter e router.push('/url')

        } catch (error) {
            // Conectar com uma ferramenta de observabilidade de erros (Datadog / Sentry)

            setIsCreatingCheckoutSession(false)
            alert(`Falha ao redirecionar ao checkout: ${error}`)
        }
    }

    return (
        <>
            <Head>
                <title>{product.name} | Ignite Shop</title>
            </Head>
            <ProductContainer>
                <ImageContainer>
                    <Image src={product.imageUrl} width={520} height={480} alt="" />
                </ImageContainer>

                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>

                    <p>{product.description}</p>
                    <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>Comprar agora</button>
                </ProductDetails>
            </ProductContainer>
        </>
    )
}

// Vai executar mostrar o conteudo na tela apenas quando os dados da API carregarem
// Paths: pode-se escolher quais conteudos deixar pre-carregado para diminuir tempo de carregamento da pagina
// Ex: produtos mais vendidos
// Deixar mais enxuto possivel, pois isso carrega na build e nao deve demorar
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
    const productId = params!.id;

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
    })

    const price = product.default_price as Stripe.Price

    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(price.unit_amount! / 100),
                description: product.description,
                defaultPriceId: price.id,
            }
        },
        revalidate: 60 * 60 * 1, // 1 hora
    }
}