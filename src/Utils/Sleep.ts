const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// <ButtonWithLoader text='Text' loadingText='Loading Text' onClick={async () => sleep(1000)}/>

export {
    sleep
}