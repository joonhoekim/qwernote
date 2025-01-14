# qwernote


## 환경변수
1. 서브모듈 환경변수 추가 `git submodule add https://github.com/joonhoekim/nextjs-blog-submodule.git`
2. 서브모듈로 환경변수 관리하므로 클론 후 `git submodule update --init --recursive` 명령어를 수행한 뒤, 루트로 복사

## prisma
DB 직접 작업하지 않고 prisma 로 관리

```bash
npx prisma generate && npx prisma db push
```