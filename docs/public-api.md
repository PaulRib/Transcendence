# Public API

The public API exposes a limited LolDle champion dataset for external clients.
It is separate from the JWT authentication used by the web application.

## Security

Send the API key in the `x-api-key` header.

- `PUBLIC_API_READ_KEY`: allows read-only requests.
- `PUBLIC_API_WRITE_KEY`: allows read and write requests.
- `PUBLIC_API_RATE_LIMIT`: maximum requests per minute for one key.

Write routes require the write key. A valid read key cannot create, update, or delete champions.

## Endpoints

Base path:

```txt
/api/public/champions
```

### List champions

```bash
curl -k \
  -H "x-api-key: public_read_key" \
  https://localhost:8443/api/public/champions
```

### Get one champion

```bash
curl -k \
  -H "x-api-key: public_read_key" \
  https://localhost:8443/api/public/champions/champion-id
```

### Create champion

```bash
curl -k -X POST \
  -H "x-api-key: public_write_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Champion",
    "gender": "Other",
    "position": "Mid",
    "species": "Unknown",
    "resource_type": "Mana",
    "range_type": "Ranged",
    "region": "Runeterra",
    "release_year": 2026
  }' \
  https://localhost:8443/api/public/champions
```

### Get Champion By his name

```bash
curl -k -s \
  -H "x-api-key: public_write_key" \
  https://localhost:8443/api/public/champions | grep -o '{[^}]*"name":"Test Champion"[^}]*}'
```

### Update champion

```bash
curl -k -X PUT \
  -H "x-api-key: public_write_key" \
  -H "Content-Type: application/json" \
  -d '{"position": "Support"}' \
  https://localhost:8443/api/public/champions/champion-id
```

### Delete champion

```bash
curl -k -X DELETE \
  -H "x-api-key: public_write_key" \
  https://localhost:8443/api/public/champions/champion-id
```

## Public fields

The API only returns champion gameplay fields:

```txt
id, name, gender, position, species, resource_type, range_type, region, release_year
```

It does not expose users, passwords, emails, OAuth data, 2FA secrets, chat messages, or friend data.