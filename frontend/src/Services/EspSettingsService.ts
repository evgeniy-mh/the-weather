

export function fetchEspSettings(): any {
    return async function (dispatch: any) {

        console.log('starting fetchEspSettings');

        const url = 'http://192.168.0.100/settings'

        const res = await fetch(url,
            {
                method: 'GET',
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Type": "text/plain",
                }
            }
        );

        console.log(res);
    }
}