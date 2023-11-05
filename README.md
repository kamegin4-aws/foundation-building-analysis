# foundation-building

基本基盤システム

- 主要コンポーネント

○フロントエンド

* [NextJS](https://nextjs.org/)
* [Cloudscape](https://cloudscape.design/)

○バックエンド

* [Django REST framework](https://www.django-rest-framework.org/#)

# DEMO


# Features

# Agenda

* Requirement [#Requirement]
* Installation [#Installation]
* Usage [#Usage]
* Note [#Note]


# Requirement

○動作環境

- Ubuntu
```bash
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 22.04.3 LTS
Release:	22.04
Codename:	jammy
```

- Docker
```bash
Docker version 24.0.6, build ed223bc
```

- Node
```bash
v18.18.0

npm
9.8.1
```

- Python
```bash
Python 3.10.12

pip
pip 22.0.2 from /usr/lib/python3/dist-packages/pip (python 3.10)
```

# Installation

各種インストールしてください。

* [Docker](https://www.docker.com/)
* [Node](https://nodejs.org/en)
* [Python](https://www.python.org/)

# Usage

### NextJs

1. パッケージのインストール

```bash
cd frontend/next-app
npm ci
```

### Django REST Framework

1. パッケージのインストール

```bash
cd backend/django-rest
pip install --no-cache-dir -r requirements.txt
```

2. データの移行（同期）

```bash
cd backend/django-rest/tutorial
python manage.py migrate
python manage.py createsuperuser --email admin@example.com --username admin
※その後パスワードを設定
```

### 起動

1. docker-foundation-building.yml の編集

```bash
extra_hosts:
      - "local_dev:10.0.2.15" ←ホストPCのIP
```

2. ビルド

```bash
docker compose -f docker-foundation-building.yml build 
```

3. 起動

```bash
docker compose -f docker-foundation-building.yml up -d
```

* NextJS [http://localhost:3000](http://localhost:3000)
* Django REST Framework [http://localhost:8080](http://localhost:8080)

# Note

# Author

* 氏名：亀谷　銀大
* 所属：株式会社エスユーエス　エンジニア
* E-mail：kamegin4@outlook.jp
* Tell：080-5257-9787

# License

* [Cloudscape](https://cloudscape.design/about/#overview)
* [Django REST Framework](https://www.django-rest-framework.org/#license)