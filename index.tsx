import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Address,
  Hash,
  TransactionReceipt,
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  stringify,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { localhost } from 'viem/chains'
import 'viem/window'

const anvil = {
  ...localhost,
  id: 31337,
}

const publicClient = createPublicClient({
  chain: anvil,
  transport: http(),
})
const walletClient = createWalletClient({
  chain: anvil,
  transport: http(),
})
const ANVIL_ACCOUNT = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
)

function Example() {
  const [hash, setHash] = useState<Hash>()
  const [hash2, setHash2] = useState<Hash>()
  const [receipt, setReceipt] = useState<TransactionReceipt>()
  const [receipt2, setReceipt2] = useState<TransactionReceipt>()
  const [receipt3, setReceipt3] = useState<TransactionReceipt>()

  const addressInput = React.createRef<HTMLInputElement>()
  const valueInput = React.createRef<HTMLInputElement>()
  const value2Input = React.createRef<HTMLInputElement>()

  const sendTransaction = async () => {
    const payload = {
      account: ANVIL_ACCOUNT,
      to: addressInput.current!.value as Address,
      value: parseEther(valueInput.current!.value as `${number}`),
    }
    const payload2 = {
      ...payload,
      value: parseEther(value2Input.current!.value as `${number}`),
    }
    setHash(await walletClient.sendTransaction(payload))
    setHash2(await walletClient.sendTransaction(payload2))
  }

  useEffect(() => {
    ;(async () => {
      if (hash) {
        setReceipt(await publicClient.waitForTransactionReceipt({ hash }))
        setReceipt3(await publicClient.waitForTransactionReceipt({ hash }))
      }
    })()
  }, [hash])

  useEffect(() => {
    ;(async () => {
      if (hash2) {
        console.log("waiting...")
        const _receipt =
          await publicClient.waitForTransactionReceipt({ hash: hash2 })
        console.log(_receipt)
        console.log("done")
        setReceipt2(_receipt)
      }
    })()
  }, [hash2])

  return (
    <>
      <input ref={addressInput} placeholder="address" />
      <input ref={valueInput} placeholder="value (ether)" />
      <input ref={value2Input} placeholder="value (ether)" />
      <button onClick={sendTransaction}>Send</button>
      {receipt && (
        <div>
          Receipt:{' '}
          <pre>
            <code>{stringify(receipt, null, 2)}</code>
          </pre>
        </div>
      )}
      {receipt2 && (
        <div>
          Receipt2:{' '}
          <pre>
            <code>{stringify(receipt2, null, 2)}</code>
          </pre>
        </div>
      )}
      {receipt3 && (
        <div>
          Receipt3:{' '}
          <pre>
            <code>{stringify(receipt3, null, 2)}</code>
          </pre>
        </div>
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Example />,
)
