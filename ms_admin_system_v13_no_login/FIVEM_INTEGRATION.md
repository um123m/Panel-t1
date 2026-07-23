# ربط اللوحة مع السيرفر

هذه النسخة فيها API جاهز. التنفيذ داخل اللعبة يحتاج سكربت في السيرفر يقرأ الأوامر أو يرسل تحديثات.

## تحديث لاعب من السيرفر إلى اللوحة

POST `/api/game-webhook`

```json
{
  "type": "player_update",
  "player": {
    "id": 33,
    "nickname": "yves",
    "character": "Travis Morthy",
    "status": "online",
    "cash": 500,
    "bank": 12000
  }
}
```

## إرسال ريبورت جديد

POST `/api/game-webhook`

```json
{
  "type": "report",
  "report": {
    "playerId": 33,
    "name": "yves",
    "title": "بلاغ جديد",
    "status": "open",
    "messages": [
      {"from":"yves", "text":"احتاج ادمن", "time":"02:30 م"}
    ]
  }
}
```

## تنفيذ أوامر من اللوحة

الواجهة ترسل إلى:

POST `/api/action`

الأوامر الموجودة:

- `give_item`
- `remove_item`
- `cash`
- `bank`
- `warn`
- `note`
- `ban`
- `kick`
- `teleport`
- `fix_car`
- `revive`
- `job`
- `rank`

مثال:

```json
{
  "kind": "kick",
  "playerId": 33,
  "value": "سبب الطرد"
}
```

حاليًا التنفيذ يحفظ في قاعدة بيانات اللوحة. لربطه فعليًا مع FiveM/ESX/QBCore اجعل سكربت السيرفر يقرأ `logs` أو استبدل منطق `/api/action` بنداء مباشر إلى قاعدة بياناتك أو event bridge.
