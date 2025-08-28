# Upbit Multichain Inflow Hunter Bot

Bot Telegram yang memantau **inflow ERC-20** ke alamat **Upbit** di **multi-chain EVM** (Ethereum, BSC, Arbitrum, Base, Klaytn, dll).
Fitur:
- WebSocket (real-time) atau fallback HTTP polling
- Deteksi `Transfer` ke alamat Upbit per-chain
- Tandai **NEW TOKEN TO UPBIT** (kontrak token yang belum pernah masuk sebelumnya)
- Tombol cepat: Explorer TX, Token, DexScreener
- Threshold jumlah (raw) dan/atau USD

> **Peringatan:** Inflow ≠ Listing. Exchange bisa menerima token untuk OTC/custody/testing. Gunakan sebagai sinyal awal saja.

## Setup

1. **Clone**
   ```bash
   git clone https://github.com/LuzAjjj/Track-wallet.git
   cd upbit-multichain-inflow-bot
