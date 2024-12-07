// PROCESS ORANGE MONEY
import { NextResponse, type NextRequest } from "next/server";

/**
 * Pour effectuer le transfert
 * S'inscrire en tant que marchand avec ses documents suivants
 * - Registre de commerce
 * - l'attestation de non redevance
 * - d'autres documents
 * => Developpeur : TOKEN & CODE MARCHAND
 */

export async function GET(request: NextRequest) {
    const merchand_code = "MON_CODE_MARCHAND"
    // const token = "VOTRE_TOKEN"

    const search = request.nextUrl.searchParams
    const montant = search.get("amount") ?? "";
    const device = search.get("device") ?? "XOF";

    if (!montant || !device) return NextResponse.json("No amount or device !")

    return NextResponse.json({
        'test': {
            'merchant': merchand_code,
            'amount': montant,
            'currency': device,
        },
        'description': 'Integration de orange money !'
    })

    // const response = await fetch('https://api.orange.com/om-webpay/payment', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer VOTRE_TOKEN', // donner par orange
    //     },
    //     body: JSON.stringify({
    //         'merchant': merchand_code,
    //         'amount': montant,
    //         'currency': device,
    //     }),
    // });
}