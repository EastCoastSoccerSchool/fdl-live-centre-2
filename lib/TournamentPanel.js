"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "../lib/supabase";
import { ageColor, buildStandings, createScoreMap, resolveTeam, scoreNumber } from "../lib/logic";
import { initialFixtures, pitchOrder, timeOrder, u1112Groups, u78Teams, u910Teams } from "../lib/data";

const supabase = getSupabase();

const ALL_TEAMS = [
  ...u78Teams,
  ...u910Teams,
  ...u1112Groups.A,
  ...u1112Groups.B,
].filter((t) => t !== "TBC" && t !== "GIRLS TBC").sort();

const FDL_LOGO_SRC = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAH0AfQDASIAAhEBAxEB/8QAHQABAAMAAwEBAQAAAAAAAAAAAAYHCAQFCQMCAf/EAFkQAAEDAwICAwkHDgwEBwADAAABAgMEBQYHERIhCDFBExQYN1FhgZTSFyJVV3GV1AkVMkJSdHV2kZKhsrO0FiM4VFZicoKTscHRMzZTcyQ0Q0RjotMlwvH/xAAcAQEAAgMBAQEAAAAAAAAAAAAAAwUBAgQGBwj/xAA8EQEAAgECAgcFBQYGAwEAAAAAAQIDBBEhMQUSE0FRYXEGFIGRoSIyM7HRFSNCUsHhBzSCkqLwJGKycv/aAAwDAQACEQMRAD8AxkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfego6yvqm0tDST1VQ/wCxihjV73fIic1A+AJkzSjVJ7UezTbMnNcm6KljqVRU/MP77k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2B7k+qfxaZn8xVPsAQwEz9yfVP4tMz+Yqn2Dq8gwnM8egSe/4jf7TEvNH11umgavpe1AOgAAAAAAAAAAAAnWguCSakarWTFN3tpaibulbI3krKdicUiovYqonCi+VyAWp0VejdUajxx5Zly1FDirXqkEUfvZrg5F2XhX7WNF5K7rVUVE25qm7cLw7FsLtbbZithobTTIiIraeJEc/bte77J6+dyqp2ttoaO2W6mt1vpoqWjpYmwwQxN4WRsamzWonYiIiIcgAAAAAAAAAAAAAAAAAAAAIlm2oWO4q9KWpmkrLk/lFQUje6TPVepNuz0/pINdcq1DuVNLV1FTacItrU33qFSesci9SNj58136tkUgvqKUnbnPkuNJ0JqtTWLztSs8ptw39I42t8IlcrnNam7lRETtU+S1dIn/uYfz0KJsml+TZXW/XDIclv0NrVd446uVe+ZvPwIqtjRexOakybong6NRHR3N67fZLXP3U0rmzX4xTh5z/Z05+jOjNNbqZNVM27+rTeI+M2hZEcscibxyNen9Vdz9FYS6K4/E5ZLTesgtkvY+KtVdvy/wC50+Tt1Q06oW3Ggvn8KbRF/wAaOsh3mhb90rk98qeffl5DM5r0je9OHlxaYuitLqrxj0uoibTyi9Zrv8ftRv6zC5wVtiurVrq54bfk1FNj1fK1FiWfnTzovUrJOrb5fylkNc1zUc1Uc1U3RUXkqEuPLTJG9ZVus6P1Giv1M9dvDwn0mOE/B/QASOMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/jmtc1WuRHNVNlRU3RUP6AKH106MmD59QVNdYKKlxrJFRXRVNNHwU8zvJLG3lsva9qI7nuvFtsvnvmmM3rD8nrsbyGifRXKhkWOaJ3V5Uc1epWqmyoqclRUU9gDL31QPTenvmAQ6gUFO1LnYnNjq3NT30tI923Py8D3IqeRHPAwQAAAAAAAAab+pxxsdrVeZHNRXMx2bhVU6t6in5oZkNO/U4PHNfPxel/eKcDfYAAAAAAAAAAAAAAAAAAFEa2azrb5ZsexGdrqlqqyprmruka9Stj8q+V3Z2eaW6rZBc6+7UunuLPVt0uLeKsqW8+86ftcu3Uqp5f81QzDncltTIZ6GzN/wD46hXvaCRebpuFdlkcvlcu6+lE7Cr1+qtWOrT5vonsb7O4dRljPq434daK923KJt6zv1Y79pnltv1sN1ucNbLWxXCqjqZt+6TNlcj379e7t9137T409VU09VHVQzSRzxvSRkjXe+a5F3RUXy7nxJBguI3nMb0y2WinVy9cszk/i4W9rnL/AKdalJWLWmIjm+t5r4dPjtkybVrEcZnwa10dyt+YYLR3So278ZvBVbJsiyN23X0oqL6SYleYrpLj9is8NHFWXXvlE4pZ4a6WHjf2u4Gu4U/IvpOwXGMntju6WLM6uZqf+2u0Tahi+biajXJ+U9PjtlrSIvG8vz3rsPR+fU5LabL1azM7RasxG3lMb/DeITM/jmte1WuRFaqbKi9pDX5fdbI5rcusEtLAq7fXCgVainTzuRE42J8qbecrrUbX6Ckmlt+H08dU9qq1a6dF7nv/AFG8t/lXl5lGTVYscb2n9WdF7O9Ia3LFMFN4/miY6v8Aujh8Ofklk2OWijvi4VeqWOsx66o+a0smTdaSZE3khYvW1NvfN286HVPTItIqhr0lqb1hCuRrkf76e3oq9nlai+jn2L10HddQ8yulwpq6tvtTJLSzJPAnJGxvTqVGpy7TSekOpFt1AtMlsucdPFdmRcNRTO5snZ1K5qL1p5U7Nzhw58Wa21fsz3fp/Z6/pXojpDovT1y54jLjn8SI35/zRw3idtt7R38Z33T+z3Kiu9sguVuqGVFLUMR8cjF5Khyyn40l0kzKOLjeuF3mbhYiqqpb51/yav8Al8nO32qjmo5qoqKm6KnaWOLJN4mJ4THN4XpHQ101q3xT1sd+NZ/OJ845THx5TD+gH4nmhp41knljiYnJXPcjU/KpKrn7Bw/rra/hKj/x2/7j662v4So/8dv+5naTdzAcP662v4So/wDHb/uPrra/hKj/AMdv+42k3cwH4hlinjSSGRkjF6nMciovpQ/lRPDTx90nmjiZvtxPcjU/KpgfQHD+utr+EqP/AB2/7j662v4So/8AHb/uZ2k3cwHFZcrc9dmV9K5f6szV/wBTktc1ybtVFRe1DA/oAAAAADj1FdRU8nc6isp4X7b8L5Eau3pPzHcrdLI2OOvpXvcuzWtmaqqvmTczsOUADAAAAAAAAAAAAQrXqGOo0PzqOViPb/B6vciL5W071RfQqIvoJqQ7XHxK5z+Llw/dpAPJgAAAAAAAA079Tg8c18/F6X94pzMRp36nB45r5+L0v7xTgb7AAAAAAAAAAAAAAAAOuye70tgx6uvNY5GwUkLpXedUTk1POq7J6TsSqukPVNno7DjT5kihuVd3SrcrtuGnhTikcvmROfoIs+Ts8c2hY9E6ONZrMeG3KZ4+kcZ+kS63CllsOJVeT3Nr6nLMue51JTNX+Ncjt+5sTyNRPfqvUibeQqG/aPagW1XyPsq1cac+OllbJv6N+L9BpDT22T1s65ddYEjnqIu5W2nVP/J0n2rfM5ybOd6EJqcc6KuakdadtuX6z6vUV9q8/ReqyThrW02n7W++0bcIrXaY4Vjhvx3nfu2YkwzA79keWx48lJLRTInHUOqGKzuMadblRea+ZO1TXuC4naMPsUVqtMCNanOWV32cz+1zl/07DgVKdz1do3uTZJrLI1nnVszVd+hyEtN9HpaYd55y5faf2j1PSkY6z9mkxE7R48efjy4eAADueQfxyI5qtciKi9aL2mItVrKzH9QrxbImcEDKhz4W7dTHe+anoRdvQbeMvdLK2d65zRXJqbNraNEVdvtmOVF/QrSt6Upvii3hL3v+HurnF0jbDM8L1n5xx/LdTRzbFda6yXamultndBVUz0fG9OxU8vlTyocIFBEzE7w+z3pW9ZraN4lrZMqxbP8ASCapv9RBRsnZ3CoZvu6KoTm3gTrVd9lRE6+rynK0EySpu+LSWe5pI252WTvWZJGq17mfaOVF5ou3JfkK/wCibjUFQy5ZHW0ccvcpWQ0ckjd+B6IqvVu/UuytTfzqTS58OM6/UFWxEZS5NRrTz+Tu8fNrvlVEanpUv8OS9opmt38J/X5vi3Sej0uLLqei8G89Xe9fCJiN5rHf93fed+MxHDhutIpTpsOczQO4uY5Wr35S80Xb/wBVC6ykum14gbj9+Uv7VC4034tfV4DL9yWAO+an+cS/nqO+an+cS/nqfI1No70Y8dzfTWzZVWZJdKWe4ROkfFFFGrWKj3N2Tfn2F/ly0xRvZV0pa87Qy93zU/ziX89R3zU/ziX89TZ3gcYp/S29f4MY8DjFP6W3r/BjOf37B4pfdsixeiM5z9A8ec5yuVUl3VV/+Vx1HTfe5mg9U5jlav1wpuaLt9spZWl2HUuBYTQ4tRVc1XBRo5GyzNRHO4nK7micu0rPpxeIaq/CFN+spWY7RbUxMeLttExi2nwYF75qf5xL+eo75qf5xL+ep8jT2k/RdtmbaeWfKZsvq6OS4QLK6BlE16M98qbIquTfqLvLlpijeytpS152qzRHW1ka7sqp2r5UkVDurJnOZ2SZstpyq80b06u5VsiJ6U32U1M7oZ2jZeHPK1F7FW3MX/8AuRPLOh7lNFE+bHMmt12RqbpFUROppF8yc3N/KqEMavBbhuk7DLXjs6rAOlhnlldFT5NT0mQ0jdkV7mpDUbf2mpwqvyt9JrHSfVbD9Srd3fH6/hrGM4p6CfZk8Pyt7U/rN3Q85M0xLIsNvDrTktpqbdVonE1srdkkbvtxNXqcnnQ4eOXq6Y7e6W82atloq+lekkM0btlav+ypyVO1FNMuix5Y3pwltTUXpO1nrCCrejfqtTao4Z3zOkUF7oOGK4wMXluqLwyNT7l2y/IqKhaRS3pNLTW3NY1tFo3hhHp3zTR61wNZK9qfWeDkjlT7eQrzo+VE7tbsNa6aRUW70+6K5fu0J/08/HbT/geD9eUrvo9ePDDfwxT/AK6F7i/y0eisv+N8XpsACgWgAAAAAAAAAABDtcfErnP4uXD92kJiQ7XHxK5z+Llw/dpAPJgAAAAAAAA079Tg8c18/F6X94pzMRp36nB45r5+L0v7xTgb7AAAAAAAAAAAAAAAAKR1MtaZbr9j9gmk4aOjoUqKhu+3G3ic5zf7yI1PkVS7jP2ot2Ww9JqyXB+7YnxQRPVV2Tgk4o1X0b7+g49bMRSvW5bw9P7K0yW1OWcX34x3mvrtt/VoBrUa1GtREaibIidh/QDseYQ3UWX603PHsmVP4iire9qpexsM6dzVy+ZHcCkyRd03Q6DUOpstLhl0fkEzYre+ncyRV613TZEana7fbbzlW6fa82JaCmtuSxVVJNDGkffiM42SbJsjnInvmqvmRTmtmpiybWnbdf4Oi9X0loYyafHNuzmYnbwnjG3jMTM77eMLxB01jyrHL21HWq9UNUq9TWTJxfkXmc+63GhtVFJW3GripaeNN3SSO2RCeLVmN4ngpr6fLS/Z2rMW8Np3+Tkuc1jVc5Ua1E3VVXkhU2U4zBrBcVnfPJR2O1pJDQ1cSIrquZypxvTfriThRE26135nev8Arpn71jWOpteK7pxK9FjqLinkROuOJfQ53mJzS08FJTR01NCyGGJqMjjY3ZrUTqREQhtWM8bT938/7LPDmt0TbtMdv33/AMePl1p5bd0c+PLMeSdHvJ6Pjks1dR3NidTHL3GRfy+9/SV0/Csohv1LZKqy1lLWVUzYYkmjVrXOXyO6lTzoblIvqjSzT4ZWVVI1Fq7era+nXyPiXj/SiKnpOLN0bi261d4es6L9vdfN64c8Vt1uG/LaZ7524THjwj1crT/G6fE8SobHAqPWCP8AjZETbjkXm535f0bEL6QG1I/D7y1P4ykvsTEXzPRd/wBUsi0V0NztVJcqZd4aqFkzPkciKn+ZW/SRVFxmwxp9k+/UyN/NedeoiIwTFeUPN9DZMuXpits33rTPW+MTutJOaFJdNrxA3H78pf2qF2M5NRPMUn02vEDcfvyl/aoWGm/Fr6vNZvuS8+0PSLoqfyfsT+9n/tXnm6WHi+tup+M2GlsVjymWkt1I1WQQpSwuRiKqrtu5iqvNV61LrV4LZqRWquwZIx23l6XA85PCK1k/ppN6nT//AJjwitZP6aTep0//AOZX/s3J4w6/e6eEvRso3pxeIaq/CFN+spLejfkN4yrR6y3y/wBa6tuFQkiyzKxrVdtI5E5NRE6kTsIl04vENVfhCm/WUgw1mueKz3SlyT1scz5MAIekvRb8QWJfea/ruPNpD0l6LfiCxL7zX9dxYdJfhx6uTR/flZgAKZYIpqlgOP6iYtPYr9So9HNVaeoam0lPJtyexfL1cupepTzVz7GLjhuYXPGbo3aqoJ1jcu2yPTra9PMrVRU+U9VTE/1QKyxUue2O9xRI11dQOilcn2zo38t/Ps5E9CFj0flmL9SeUuTVY4mvWVv0Wswkw/WWzVDpu50dwkSgq0V2zVZIqIir8juFfQekB5IQSPimZKxytexyOaqdaKnM9YrDVrX2Kgrl66mmjl/Oai/6m3SVIi1bMaO3CYYa6efjtp/wPB+vKV30evHhhv4Yp/10LE6efjtp/wADwfryld9Hrx4Yb+GKf9dDsxf5aPRz3/G+L02ABQLQAAAAAAAAAAAh2uPiVzn8XLh+7SExIdrj4lc5/Fy4fu0gHkwAAAAAAAAad+pweOa+fi9L+8U5mI079Tg8c18/F6X94pwN9gAAAAB/EcivViLzREVfSf06C2XBXZveLXIvOOlpp40/qu40X9LTWbbTHmlx4pyVtMfwxv8AWI/q78HxjqoX1clKj0SaNEcrF6+Fepfk609B9jZHMTHMB8K9Kxady0L4Gzp9ikzVVq+Zdl3T5SGXvKs2tLVc7T+S4NT7ehr2yIv91Wo79BpfJFOf5OrTaPJqZ2xzG/naK/8A1MJ0dfkN7tWP2yS43ithpKZnW+R226+RE61XzIU/cdQtW7urqWw6e1VscvJJaqB6qnyK9Gt/LudCzSDUTMK9tbmt7bTp9y+Xuz2p5GtavCn5Tlvq5twxVmZ+UPQab2bxYp6/SOopjr4RaLWn0iN/6+j537Wu43rUC0w2SKeGywV0fFE1qrLVJvsquROzZV2anm38316W9vfBfbFfY27ccDoFd5FY7ib+uv5C3cB03xfDY2vttH3atRNnVlRs6VfLsu2zU+Q6jpE45JkGnFTJTxrJU25yVbERN1VrUXjRP7qqvoIMmnyzgv2k7zPH02W2i6a6Nx9MaaNFj6mOu9Zmedutw3n48d5n5JXgV7p8hxC2XaCZkndqdiycLt+GRETiavnRdzvCoNIcPpqvTSyXWzXSss1zkhcsk9K9FZK5JHJ/GRu3a7bq7F5dZLe5alUkTom1mO3Pls2WSGSB/wAqoiq38h2YstppE2ju7nmukOj8FdXlx4csRtaY2tvE8Jnv4xt8YnyUH0kM4myDKpLDSSbWy1yKzZF/4sycnOX5OpPkXylTnYZHQXC2X2toLrG5lbDM5syO7Xb9fn369zrzzWbJbJebW5vvXRWiw6LR48OD7sRHHx8/jzf1rnNXdqqi+Ytbo9V0t41Jt9BfKiW408cMrqWGqkWRkUiN4kc1rlVEVERSqCa6GVXemrGPy8W3FUrF+e1zf9TbT26uWvrCHp3D2vR2fbn1LbT8JbRAB6t+bw/MrGSxujkajmPRWuavUqL1n6Osyi/WvGrLPd7vUtgpoU3Ve1y9jWp2qvkMTMRG8t8WO+S8UxxvM8ojnu6bSXjjwelonuVzqGWajVVX/pSuZ/oRnWNVuec4LjsezlkuK1crf6kab7/k4iMaZ61YzSd8W27QVVC2or6iobUKnGxEllc9Ecic0236+ZI8BqI8x1dvmWx7S261wpbrdInNrlXm96L1Lvz9DkOCMtMuOuOk78vo9lfo7VdHa7PrNRjmsVi0xPdM2+zG0+tt/SFrFJdNrxA3H78pf2qF2lJdNrxA3H78pf2qFtpvxa+rw2X7kvPsuPBejlqBmWJ0GTWmSzpRVzFfEk1U5r9kcreacK7c0UpxD0i6Kn8n7E/vZ/7V5c6zNbDSJqr9PjjJbaWW/BM1R/6th9cd7A8EzVH/AKth9cd7BvMFd+0M3k6/dcaCaB4ndMI0stONXlYFraRJEkWB6uZze5ybKqJ2KQjpxeIaq/CFN+speRRvTi8Q1V+EKb9ZSHBabZ62nvlJkjbHMR4MAIekvRb8QWJfea/ruPNpD0l6LfiCxL7zX9dxY9Jfhx6uTR/flZgAKZYBj76odURLcsTpEVO6pDUSKnmVzE/0U2A9zWMV73I1rU3VVXZEQ86OlZnsGe6s1lRb5EktdtYlFSOReUiNVVc/0uVdvMiHboKTbLv4ObVWiKbeKpmpuqInbyPV/FqZ1HjFqpHps6CihjVPIrWIn+h5paJYy7L9VMesPc1fDPWsdUIn/RYvE/8A+qKen6dRP0lbjWqPRxwmWDenn47af8Dwfryld9Hrx4Yb+GKf9dCxOnn47af8Dwfryld9Hrx4Yb+GKf8AXQ68X+Wj0QX/ABvi9NgAUC0AAAAAAAAAAAIdrj4lc5/Fy4fu0hMSHa4+JXOfxcuH7tIB5MAAAAAAAAGnfqcHjmvn4vS/vFOZiNO/U4PHNfPxel/eKcDfYAAAAAVNqdfVwzVrHchnRfrbcKR1vrHfcoj+JHehX7/IilskE1yw92YYNPT0rUW4Ui98UqbfZORObPSm6fLsQamtpxzNOccfkuOgsuCmtrXUfh33rb0tG2/wnafg7fMrNUXq3wXGxVzaS70qd1oapF3Y5FTmx/3UbuW6fIpE8Z1doW3B9hzekdjl5hXhf3XnA9fK13Pbfz8vOVnotrBLjTI8cynu0tujXghqOt9Nz+xVOtW/pQuzI8aw7UmyRVEyU9dEqfxFbTPTjZ5kcn6q/kOembto6+Gdrd8T/wB+q71fRkdFX916TxzbF/Dkrzj07pjxrPLjMecpoa2jroG1FFVQ1MTup8T0ci+lD7mb71ojmmP1bqrDb++eNPsUbO6nmb5uS7L8u6fIdJVR68UCrE9+TvRvLdj3S7+lNzE6y9OF8c/Dizj9ltJqvtaXW0mP/b7M/Jqs6O/ZdjNiY512vlDSq3ra6VFf+am6/oMq3CHWC6osNbDmFQxeSseyfhX0dRxKPS/UGvlTbG69qr1unRGfl4lIrdIZJ4UxyscHsTo8f2tXrKxHlMfnM/0W1mfSGoIFkp8Wtj6t6ckqardkfyoxPfKny7HS6JaoXW6Z9PQZXcVqILuzuUaP2SOORN+FrW9SIu6p512OqsfR+zCse11yqrfbY9/fbvWR+3mRqbfpQsrFdBMVtM0VTcKusudRG5HNVV7ixFTqVEau/wCkjpGsyXi88Ij4O/V39ldBo8mmxT1rWjbePtW37p35Rx7omH6wSd2nueVeDXGRW2i5yOqrLM77FHL9lCvkX/VP6xbRGtQ8Qocvx9bfO5YaqFe6UdU1V44JU6nIvX8v/wDhHtOc2rEuH8DM0RKTJKf3sb3cmVrOx7F6lVfJ2/lRO+k9jbqTynl+n6PF6un7Uxe+YuOSsfvI752/jjyn+Lwnjyl12vWmLcuoPrzZoo23umZzanLvpifaqv3Sdi+j5MqVVPPS1ElNUxPimjcrXsemzmqnWioegRVOs+D4/f7/AI4+opO41VfcEp6ioh9698aRPdsvYq+9TmvM5Ndoov8AvKc3pfZD2tvpIjR6mJtSImYnvjaN9vOOHDw/LJ5MdKsdya55PQ3Gw2iWs7xqGTq5XJHH7xUXbjXkirsaPsmiuAW2RsrrXJXPau6d9Sq9v5vJF9JYFHS01FTspqOnip4WJsyOJiNa1PMickIsPRdone8/JZ9K/wCIWC2KcekxTaZ4b24R8onefnCMW/PLVxNpr9T1WPVqrwrDcGcLHL/VkTdjk9O/mJVBNDPE2WCVksbk3a9jkVFTzKh+aulpqyB1PV08VRC9NnRysRzXJ50XkRZ2n1jp5nT2Sa4WKR67uS3VTomKvnZzb6Ni1/eV8/p/36Pm/wD4Wbjxxz/uj+kx/wAnbZfklpxayTXa71LYYY0Xhbv76R3Y1qdqqZA1Pz27ZzeVqqtVgool2pqRrvexp5V8rl7VOZrfcr1PnNbaLpd6m4xW2VYad0yNRUbyXdUaiJvz69uxCDQxyTSsiiY58j3I1rWpurlXqREKPW6u2W00jhEPsHsn7MYOjsNdXkmLZLRvE90RPhv4xzn4evItFvq7rc6e20EL56qokSOJjU3VVU25p3jNNiOI0Vkp0aromcU0iJ/xJF5ud+XknmRCAdH/AEwXF6VMgvcSfXioZtHEqf8AlmL2f2l7fJ1eUt87+j9LOKvXtzl4v229oq9IZY0unnfHSeM+Nv0ju8ePkFJdNrxA3H78pf2qF2lJdNrxA3H78pf2qFxpvxa+r5/l+5Lz7Q9Iuip/J+xP72f+1eebqHpF0VP5P2J/ez/2ryz6S/Dj1cWj+/Pos8AFMsQo3pxeIaq/CFN+speRRvTi8Q1V+EKb9ZSfTfjV9UeX7ksAIej/AEX6ykj0FxNklVCxyUa7osiIqe/cecB9GTzsajWzSNROpEcqIXWpwdvWK77K3Dl7Od9nrG+429jVc+upmonWqytRP8yMZNqjp5jcL5bxl9pg4OtjJ0lf8iMZu5V9B5iLU1Cpss8qp53qfJVVV3VTkjo2O+yedZPdDSPSB6TVZltBU41hUNTbLTNuyorJF4Z6hna1ET7Bq9vPdU8nNDNx9qKlqa2qipaOnlqKiVyMjiiYrnvVepEROaqaj6PfRhrqqsgyLUemWkpInI+C0u/4ky//AC/ct/q9a9u3b1zOLS08EO181km6DWl0tptk2ol5p3x1dfEsNtje3bggXZXS/K5URE8yL5TUR+YY44YmRRMayNjUa1rU2RqJ1IiH6KPNlnLebSssdIpXaGDenn47af8AA8H68pXXR9c1mtuHOe5GtS706qqrsie/QsXp5+O2n/A8H68pQDXK1yOaqoqdSp2F5gjrYIjyVuWdssz5vQ2pt2bOuNTKy4zSL9d3TRI69KyCSnV7+FFRsvE1GtVF2aic0TdHodw+13ajw/J6anutZWXGrqpfrbxXx/FHFuncla9z/e7bqqpvz22Xc83++an+cS/nqO+an+cS/nqQToZn+L6f3Se8x4PQ2nos3jyZaypuk09A+4wSNYy8MRzIk7p3RVZujdla6JisTfmx7k2VUVZ5pu24RYpBBdXSLWMkl42yViVLmtWRzmNWRFVXbNVERVXfZOZ5bd81P84l/PU2T9T1kkkxbK1ke56pWwbcS7/+mpBqdL1Mc23+iXDn619tmowAVjsAAAAAAh2uPiVzn8XLh+7SExIdrj4lc5/Fy4fu0gHkwAAAAAAAAad+pweOa+fi9L+8U5mI079Tg8c18/F6X94pwN9gAAAAAAApLWzRr6+VMuQYsyKKvciuqKT7Fs6/dNXqR36FKFt11yrC7rJFS1Nws9Wx20sS7s3VPumryX0obnOnyTGMfyOn7he7TTVrdtkV7ffN+Ryc09CldqOj4vbr452l7roX21yaXDGl11O1x8vOI8OPCY9fmzrjvSDymiRsd3oKG6RonNyIsMi+lN2//UmFF0jbI9E78x6uhd29zla9P07HKvvR5xqpe6S03OvoN+aRv2lan5dl29KkTrOjje2qvemQ26ROzusb2f5Ipz7a/Hwjj8l1OT2O132rR1Jn/wDVfy+ymLekLiKpzt10T+4z2j8ydIfE2p7y13R6/wBlif6lfP6PObIvva+xuTy98Sf/AJn7g6O+ZOcndbnY429qpNIq/qDttd/L9D9l+yEce2/5SllX0j7Y3fvTGauTyd1qWs/yRSOXbpF5HNytlkttI3yyq+V35UVqfoOTS9HC7Kqd85JRMTtSOF7v89jvrf0c7MzZa6/10vlSKJrE/Ku4219/L5Mxb2N0vGI60/65/PgrKXWvUGSujqXXaNGseju4sga1jkT7Vdk3VPSW/bL9hGstnjoa/a2X+FOKHZ6Nmif91E/7dN+e36O07qzaJ6fW5zXyWuave3qdVVDnJ+RuyfoJnaMdsNoa1trs9DR8PUsUDWqnp23J8Gm1Eb9rbeJ7uan6Y6e6GyRWdBhtjyV+7au1fnEb7x6q4gybMtO9qPNKOW+2Zq8MN4o28UjE8krf9f0qfjM9RsMulwxSW3X+nkkhu8U8jVa5vBErHtcrlVNm7cSdaluva17VY9qOaqbKipuioQHL9IMJyJzpn25bfVO5rNRr3PdfO37Ffybk2TFmrXak7x5/qqtF0j0Zlzxl1mOaW47zTbad4241nl/pn4J8xzXsR7HI5qpuiou6Kf0qm36eZ3jsEdJi+oL2UUX/AA6eupGyI1PIi89k+Q5veOtTPetveIyp92+CVF/IjdiSM1v4qT9P1cN+isEzvi1VJjz61Z+MTX+srJOPX11Fb6d1TXVcFLCxN3STSIxqJ8q8iupcZ1auCo2tz230MS/ZNoaFN/Q5yIp+rfo7ZH1TazJrrdsknRd9qyoXue/9lOv8o7XJP3afP/skaDRYuOfUxPlSJmfnMVj6qDySz3XUDVK9SYxRyV8M9a9WzsT+KazfZHOd1InIvbSTSC14gkdzuix3G8pzbJt/FweZiL1r/WX0bFkW230NspW0tvpIKWBibNjiYjWp6EOSQ4NDSluvbjK06W9rtTrMEaTBHUxRER5zERtxn+kfUAB3PIhDtY8Dp9SMGqMWqrjLb4ppopVnjjR7k4HI7bZVTr2JiDNbTWd4YmImNpZY8DSxf04uXqTPaNB6Y4nDg+C2vFaeskrYrfGsbZ5GI1z93K7dUTq6ySAlyZ8mSNrTu0pipSd6wAAhSBC9ZsAptSsIlxequUtujknjmWaKNHuTgXfbZVTrJoDNbTWd4YmImNpZY8DSxf04uXqTPaP6nQ0sW/POLl6kz2jUwOj3zN/Mi93x+DMFP0N8Xa9FnzC8SN7UZTxsVfTzJNZuihpVQva+qS93NWruqVNajWr/AIbW/wCZfIMTqs0/xMxgxx3Ixhmn2F4cm+N45b7fIqbLNHEiyqn9td3fpJOAQTabTvKSIiOQADDKktbuj1bNUMxZklXktZbZGUjKbuMVM16KjVcu+6qn3X6CC+BpYv6cXL1JntGpzpsgyrGsfljivd9t1ukl+wZU1DWK75EVTopqc0RFayithxzO8wzj4Gli/pxcvUme0PA0sX9OLl6kz2jUdLUQVVPHU000c0MjUcySNyOa5F6lRU60Pobe+Z/5mPd8fgyx4Gli/pxcvUme0W5oLpJRaTW26UVFeqi6NuEzJXOmhbGrOFqpsmyrv1llg0vqct46tp4Nq4aVneIAcWK40EtyntsVXC+tgY2SWBHor2NdvwqqdaIuynAv+V41YJo4b3frbbpZfsGVFQ1jnfIiqQxEzwb7w7kH4p5oaiCOenlZLFI1HMexyOa5F6lRU60P2YZAAAIdrj4lc5/Fy4fu0hMSHa4+JXOfxcuH7tIB5MAAAAAAAAGnfqcHjmvn4vS/vFOZiNO/U4PHNfPxdl/eKcDfYAAAjmp2Qz4np/fMlpqeOpmttG+oZFIqo16tTqXbmURhut+teY2VLzjelVuuFAsjokmZWcKcTetNnOReW5LTDa9etHJpbJFZ2lpoFEap9IB+AWCzUNwx9KjNbhRsmntccq9zpHO7HOTdV577NTmu3WhCazXzXHHaVl9yvSqGCxOVFc9tNPC5jV8r1c5Gr/aahvXS5LRu1nNWJatBXWLaxYffdLarUFlTJTW+hY7v2GRP42GRNvebJ1qu6bbde6FNQdIfVnMqupn010yZV2uB/Cs1RDLMq+ZXNcxqO/qpupiunyW34bbeLNstY2aqBQOjnSJ/hPlC4XmWPux3JVc6OJi8TY5ZUTfuatenFG5exFVd/LzRDq801m1txK1VV5velNvpLXTvRrql9ZuiIruFq7Ncq81VOwz7tk63Vnn6sdtXbdpIGdcG1e1ryultl1oNK6CWzVsjf/FsrOqPj4XORFdvy2Xs7Drn9IDUi56g37E8S0/t95mtMs3EjZ3I9YmP4OJUVU3XdU5J5R7rfeY4cPODtqtNgqDo860s1PmudouFlfZr5a0R1RBxq5jm8StVU3RFaqLsitXyn46S+sz9J6K0soLfS3G43GR69xmkc1GRMRN3e959aoienyGnYX6/Z7cW3aV6vW7lxArro+amR6pYIl8kpYqOvgqH09XTRuVzWOTm1UVeeytVF+Xcj8usF0Z0kG6WpaKNaFWI7vvjd3X/AIPdOrq6+Q7G/Wmu3GDtK7RPiuUHXZPcJLTjlyukUbZJKSklnax3U5WMVyIvm5Fb9GrVS5aq4/dbncrXSW99FVNgayne5yORW8W68RrGO01m0coZm0RPVWyAUV0gta8i08z6zYrYMdobtLdKVksfd5XMcsjpXRo1Nl2+1Tr8ox47ZLdWpe8UjeV6gzPeukJqPhNfSv1F0qdbbZO7g74p51XZfM73zFXb7XdFJjrPrdHiemFiznFKWkvNJd6hscfd3OYiNVjndnNHIrdlRfOSTpsm8RtzadtXaZ8Fzgz1ZNUdfLrTUddT6Q0D6GqayRkza1OcbtlR2yv36l3O0smtV6g1+m0wy2yUFvZIrm0VZDI7eVVRHxKqLy983dOXU7kJ09+PLh5s9rVeIKY6RWtU+mtysljsdrp7verm7i73le5OCNV4WL73mquduif2VOn1j1szPCM1x/Ebbi1sulzutDDK6NZnt/j3uc1WN57bbt5KpiunvbbbvJy1jffuX+Cn9Pc01nu2WUdDlemVJZbRJxd3rGVaPWPZqqnLjXrXZOrtOP0etY7rqZkmR2u4WeioI7Tt3N8D3OWTd7m89/7InBaImfDzIyRO0eK6ARvUrNLNgGIVeS3yVzaan2a2NnN80i8msanaq/oRFXsM70Wv+teVslu2D6WQ1FljeqNe+nmnc9E7Ee1zEcvmai7DHgvkjeORbJWs7S1YClNBtfKHUO8S4verS+w5JC1y97Ocqsm4fs0bxIitcnWrV57IvPkpEbhr/qLV6nZFheJYDQXqez1FQ3Zs70kdFE/g41TdE35pyTymY02TrTXbkx21NolpkGZrb0o5K7Tq+3T+DcVJklldF3ahmkcsUjHyJG5yLsjkVqrsrV6t0LL0E1etOp2ITXJ7Yrfc6DlcaVX+9iTmqPaq9bFROvs2VFF9PkpEzMM1y0tO0Ss4GfcL6Rjcw1yiwix2mnfZJXyRx18j3JLJwMc5XI3qRqqnLfnsdZWa96j12pt+wvEMCtt5mtdTNGn/AIlzHOjY/h4l3VE8nUZ91yb7THdux21Nt2lQUl7pmp9o07yrKMxwGisstpp45aKJanjbUKr0a5FVrlVNkVD+dHPX2g1PqamzXWkp7TfYkWSGBj1WOoiTrVqr9snank5p1LtrOnv1Zt3QzGWu8R4ruBSOqWtN3xDXHHNPqWy0VVS3Z1I19TJI5JGd2mWNdkTlyRNyO5vrJrZiNrrr1edKrfS2ikkRrqp9Zumznoxq7I5V5qqdnaZrpr228/NictY38mkAZ0wTV/WrLaO23a3aWW+ay1sqJ34ys5Izj4XuRFdvy2Xs7DQV2qXUdrq6xrUc6CB8iNXqVWtVdv0GmTFak7S2reLRvDkmaWV2D4vrNnFXrBb4VrLhUtdZqu40S1FO+hRuyRxe9VEcnU5Nt/0k46NGrVy1XtF4rbjaqS3OoKhkLG073ORyOaq7rxHYdI/USr0zwimv9FaqS5SvrmQdyqVVGoitcu6bdvvSWlbUvOOY4zw5tLTFqxdWGY6l5BYsipLLh/1vxjGW2uCosiV8fe8dVxO9+1Wujc7ZObUY3hcnJe3Y7a/agZ5T3q/3CC9wR0NnyS3W9tAlExWyxVDY+NFkX33JX7ovXy/J87Nqlrxe6CiudHo/bp6KpY2aCZK1ObHJujkRX7pyUtnVfMocD02uOV1lNE+amharIHLskkzlRGs3Tzr+RCW32ZivVjf1iWkcYmd5UlkGb5Dit41YkTMX/XuimZLbaCppWKkkPCzZzd0+xajlTl8q81OdqpqBmGC49TR1mZyVOR1VA66QQw22CKmRm7UWJXP3c9E99sjU4l5qqoiHZ9G/XqTVHJ7hY7zZaG21cdMk1MsD3O7q1HbPavF5N2qnpJzrlqpjul1hirrrA6trqriZRUUeyOl2+yVVX7Fqbpuv6FE71yRSacfh4ehG01m0W4Og0rukV71wyS8QPbJFW41ap2vaiojuJJF5b9hCbfXYLiurmdz6v22P65XCt47XV3KiWogloeHZrId2qiKnUqfInYp11r1u1+u1Ol8tOkcE9menFHw0dQr5GditdxpxfKjdiaZprbdbTobbtQXYjHTXCav70mttc528LkV7XLvsiou7e1O0zOO8W2257RwljrVmOfLjydLmGo9ysdRV0OPXH+C1rorNS1GLW19s4luyvRP4vZycSbLszgbsqclXyHJybWC6W3Uyy21bpPSJ9cKOkvNvnpomw06TQo5yMXZZXqjl+z5N7EResurAru/JsJsWQ1VNFFPX0MVUsbOaRuexFVEVefaVhpzrDcsp12yTT6pslBT0tpdUoyqY5yySdxlRjd0Xl1LuaVmJ3+zy5tpjbb7XNAbtqFmt9wzUm1/wiqZLjaoVqGVFrgjdTpTLLwqxrkakkb0ZxcSO3VNlVFQ0BpLc6a7YJb6ykyBt+jVnD322NrE3RERWbIiJ73q38xQOEdILVTNai4RYlplarmtI5O+e51Ss4d1VE34nJvvspemkV6za9WOpmzfFIMbq4p+CCnilR6Pj4UXi3RV7d0GorNa7TER8YMVomd9901Idrj4lc5/Fy4fu0hMSHa4+JXOvxcuH7tIcboeTAAAAAAAABfvQLySlx/X6npax7WMvVvmtzHuXZEkVWSsT5VWLhTzuQoI5FurKq3XCmuFDO+nq6WVs0ErF2dG9qorXIvlRURQPZAFT9GvWa0atYhHIssNNklFG1tzoN9lRerusadsbl/NVdl7FW2AIF0iPEdmP4Km/yM2dGzFdZrvpnHWYRn9DZLQtZM1tLNTo9ySIqcTt1jXr5dprXPMehyzDbtjVRUyU0Vypn075WNRXMRydaIp02jOn9JpphbcYorhPXxNqJJ+7TMRrt37ctk+Q6seaKYpr37ob45teJ7mWZXT4r0xLLPqRcIKiSOGmR9fK1GxOl72RiS9SIid0ReeybL5DWuoV5x23YLda6+1lG21uo5Eesj0VsrVYvvU+6VepETrOk1i0kxPVChhjvsEkNbTIqU9dTqjZo0Xrbz5Obvz2X0bcypKXog2TvmNLjnN5rKNjkXvdIGs3TycSuXb0IbzfFlis2naY8msVvTeIjfdQWKW+7z9HHOayihn+tqXigc/bfbhb3Ti+XZXxb+g130SbtYKzQ6w0tqnpknpIVjrYmuTjZNxKrlcnXz60XyKTrH8HxaxYUmHW+z07bKsTopKZ7eJJUd9kr1Xm5V7VX/YpC+9EfGZ7lLU4/ld3slPIu/e6MSVG+ZHcSLt8u5vfPjzRNbTtx3a1xXxzExxQPpM1ltyDpPYnR4jNDUXeF1NDVy03PaZJlciKqdbms238icuwuzpkfyfb5/3Kf9q05OjOg2Iaa3B13ppKi7XlWKxK2rRN40Xr4Gpyaq9W/NduW/NSXas4VTahYNWYrV101FDVOjc6aJiOc3hcjupeXYR2zU69IjlVtGO3VtM85RjopeIDF/vd/wC0eZmwKy5xfOkbnNJgWSQWC4o+rdNUSs4kdF3dqK1Peu2XdWrv5jY+meJU+D4PbsWpauWrhoY1Y2aRqNc7dyrzROXaU/eOjDQ1mW3TI6LPL7a6m4zySyJSMRmyPdxK3dHIqpv/AJG2LNSL3mZ5+W7F8dprXbuQjosVUmAa7ZFpzkFFT1l9rXOWW7wzufxK1vdeHZex3EqqvJd+S9XKHZRm+GZf0qJr9m9zZFi1oe6CnRYZJmzJDujGo1iKuznqrl5bKnymgsA6PGO4cl0r6K+XOpv9dSy0zLpUbOfTpImznMb1cW3aqqp2Wkeg2F4DbK2mnpabIp6uZJHVFxo43uY1E2RjUVF2TfdfPv5kJJ1GKLWv3zG36y1jFfaK9zPvRIzO04vrld8Tt9elVj99mkjoKjgcxFexXOiXZyIqcTeJuypvuqEpqf5fsf8A2k/dS0tQdBMayTLLPktnqUxittatcxLdRxtZI5r+JquRNk3Rd0+Q67Uno8UOZag1OZtzC7WiunaxqJSRtTg4WI3k7dF5ohic+K1ptvtvGx2d4rt4StPUP/kK/wD4NqP2TigPqfP/ACLkn4SZ+zQl2IaBS2G6yVs+o2S3SOSkqKZ1PVPV0apLE6Pi2Vy804t086EbtfRTprVG+O2alZLQse7ie2nRI0cvlVGuTcjrOKMdqdbnt3N5i82i2zSRkbpZ/wAprTz/ALVJ++PNCaQYHJp/Yaq1SZJc7+s9Us/d69272bta3hTmvL3u/pUiutuhlv1Pym35BU5HcLTUUNK2njSmjavU9z0duqoqLu79BpgvTHk3meDbLW16cuLkdLCuslLoXkEV4lgR1RCkdJG9U4nzcScPCnXunXy6k3MsZXDWxdDfFFq0cjH5FM6n4v8Ap8L/ANG/EXxS9FbHqm5Q1WT5jkeQRRLyhqZdkVPJxbqqJ8mxPNXNH7Hn2E2rEo6p9jt9smbJTspIWqjUaxWI3ZepNlJsWbHi2rE78d0d8d77zMdytNNcM17fYcdrafU22x2dYKeRtItK3iSDZq8G/c+vh5b7nw6cGH1kFLZdUbE50Vws07Iql8ae+RnFxRyf3X8v7yeQ7Wj6MstJ3FsOquWtih2RkbZFRqInUiJx8kLvyvHqDJcSr8buaLJSV1K6nkXtTdNuJPOi7KnnQ0tnrXJF6zv8Nm0Y5mk1mPqyj0fWVms/SJr9Sr1R8NFaI45IYne+ZHLw8MTE+TZz/lRD9dLemulX0lsMpbJWsobnLS0zKWoe3dsUizycLlTZd9l8ymj9GtOrTpjh6Y7ap5KrinfPPUysRr5Xu2TdUTyIiInyET1o0KoNSsvoslmyW42iqo6ZsESUsbVVOF7nI5HKqKi7u/QbRqKdtvyrEbQ1nFbs9u9+tMcT1ptWW09bmmoVBerM2N6SUkVMjHOcrferukadS8+sqfoK/wDP+e/3f2ryz9PtCqjE8uob+/UbJbq2kcrlpKqRVik3aqbL75fLv6CMRdFWjpbjV1tt1DyG3vqpHPk71ake+6quy8Lk323EZMcxas257dzPUvvExHLzfD6oHTVsunNhqIWSOpILovfCtTk1XRuRir/9k9Jbmhd4xy56S45Lj81M2jgt0MT4mOTeF7WIj2uTscjkXffr6+06PAtFbfYbJfLJkGRXTLLfeI2Ryw3NyuSNGqq7t98uy7qi7ptsqIV7ceiHYFrJH2fNbzbaR6797rE2TbzcXE3f0oa9bFakY5ty79mdrxbrxHNCL9UUWQ9Oi1T4XJHK2GrgWsmp+bHLGxe7runJfeorVXtU6XGaDPrj0qM8ptObxQWm7rUVyy1FYxHM7j3w1HIm7He+3Vqpy7Os0/ozoxiWl7Jp7S2atudQ3glrqnZZFb9y1E5NTfydZ8MF0bt2KauX3USC81VTVXju/dKV8TUZH3WRsi7Ki7rsrdiT3mkbxHdG0b97TsbTtM+O7P8An2idZppojlt/v15jul8uctPFI6FHdzY1Z2vcu7tlc5zkRVXZOojNLpDmLsJxPJNOpbh3LKqJKC7QwyKiRuVytc56/wDSdw7rv1Ki9iohsrVzCKbUPB6rFquumoYah8b1miYjnJwOR3UvLsOZpvi0GFYRa8WpqqSrht0SxMmkajXPTiV26onymsa20U379/pszOnibeWzJGm+G0WA9MSy4rRSOmbRUje6zOXnLK6kVz3bdiK5V2TsTY4eLWjN7z0ns4psDyOnsNxbVVbn1E0SPR0fdU3bsrXdu3Z2GlptH7dLrk3VRbxVJWNYje8+5N7nyi7n9lvv1cyGZD0ZaK55ndsopM7vlqqrlUyTyJSMRnDxu4lbxI5FVCSNTSZ3me6I5d7WcNojhHe42odj1FsnR3z5moOV0uQzS08S0roIUZ3JqSN4kXZrd912KSxzS+7z6H2TVfBpp4MgtNRM6pjgT38jGSLtI3yuanJW9rfk56Ns2gbaLE8kx6uzy/3WG+U0dO59WvGtPwvR/E1FcqbrtsTvSLBaXTvB6fFaSumr4YJJJEmlYjXLxuV22ycu0jjUxjrPVned/Dbhs27GbTxjuYurdQk1L6QOmuQywJBWsqLbS1sbU2akzKtVVW/1VRyL5t9uw1D0x/5OuSf2qX95iOrrOjViq6qUudWy51VtWC4RXDvCKFqwrIx6PVEXrRHKnUnVvyLJ1Ywum1BwK4YlV1stFDWrErpomI5zeCRr02ReXNW7ekxkzY5vSa8oZpjvFbRPOUR6I38nzGP+3N+3kLHyf/lu5/ekv6inVaW4fT4HgtuxSkrJayGha9rZpWo1zuJ7nc0Tl9sd/caZtbb6ijc5WNnidGrk60RyKm/6TlyWi2SbR4pqxMViGYfqen/K+Vff8X7NSQdPXno9RbfC0X6jzg2vopUtqY9lr1JyShbIu720yJGjl8q8Lk3O/rOjtT1+n8+I3LOb5Xxy3FlclVUokkjFaxW8CcTl5c9zstkxdt2sW+iCK37PqbIrpdhmvc+H47WW3U2201nfSwSQ0jqVquZDsiozfufXty6yPdO3MGVl/sGn3fzaemhc2suMmyqjHO96xVROa8LVc7bbf3yE2pujFJTQxw0+quWxQxojWRskVrWonUiIj+SElsOgNjp9TqrPMiu02S1U7XIlNXUsawtVWo1q7LvvwsTZN/lMxmxRk68zvtvyjZjs7zXq7fVmLJMuwXC9bsZy3TC5d+2mkp4IqyFtPJCuzE7nIi8bW7q9nPfn77fcnfS3qaWTXbT+93NzZsYmpKZ6Pcm8at74c6Tf+65ir5ti+9UNFsKzbGHWaO10Fjl7q2VlXQUMTJGqnZyRN0VFXkf2s0cxy8aV23AsmmmvEdtj4KWvciR1EWyrwqip1bNVG+RURNxGpx71tx3jh57HY32mPi4uvGd5RhmC0mT4NaLXeLdGivrZZZU7nDDsnA5uz2q7dV25blM65Zfc9ROiNbMtuFFT09RNd0SWOmR3A1GvkYi81VexO3tJC3ojWtVSml1Avr7Yj9+9O5NRNvl4tt/Pwly2TTHErZpmuni0TqyxOjex8dS/ic5XO4ldv2Lxc0VNtlRNiOL4cXVmvGYn6NprkvvvwjZwej7fLVctFMXqaWugfHTWyGGdeNP4p8bUa5rvIqKi9ZQHRpqIrv0tc8u9vclRQyJXysmZzarXVDeFd/P2EnruiFYlq5VtebXiho3u373WFr9k8nFxJv6ULe0d0qxjS+zVFFYmSy1FUqLVVk6ossu2+ycuSIm68k8qib4qVtNZ3mxFb2mu8bbMh9F2w6k3u45Imn2W0uPLE6PvtZ4Uf3XdX8O27HbbbL5Os2VpPaszs+MPpM7yCC+3Val721MMaMakaonC3ZGt6lReztKat/RRo7bLNJbNRsioFmXeTvZqR8Xk34XJv1lt6P4BJp9aKy3yZNdL+tTOkqS17t3R7N24U5ry7TOqy0ybzWfpx+ZhpanCY+qcFV9LHJ6XFtAMrqKh7UkuFE+2U7F65H1CLGqJ50ar3fI1Sz6ypp6Ollq6ueKnp4WLJLLK9Gsjaibq5yryRETtU85emLrRHqhl8VosMrlxizPclM/mnfcy8nTqn3OybN357bry4lROF0qGAAAAAAAAAAHPx69XbHrxT3ix3Gpt1wpnccNRTyKx7F+VOxepU6lTkpqfTvpq32gpIqPOMYgvDmIiLXUMqU8rk8ro1RWOX+yrE8xkkAb+b01tLVanFj+ZI7bmiUlMqIv+Of3w1dLPgDM/U6b6QYAAG/8Aw1dLPgDM/U6b6QPDV0s+AMz9TpvpBgAAb/8ADV0s+AMz9TpvpA8NXSz4AzP1Om+kGAABv/w1dLPgDM/U6b6QPDV0s+AMz9TpvpBgAAb/APDV0s+AMz9TpvpA8NXSz4AzP1Om+kGAABv/AMNXSz4AzP1Om+kDw1dLPgDM/U6b6QYAAG//AA1dLPgDM/U6b6QPDV0s+AMz9TpvpBgAAb/8NXSz4AzP1Om+kDw1dLPgDM/U6b6QYAAG/wDw1dLPgDM/U6b6QPDV0s+AMz9TpvpBgAAb/wDDV0s+AMz9TpvpA8NXSz4AzP1Om+kGAABv/wANXSz4AzP1Om+kDw1dLPgDM/U6b6QYAAG//DV0s+AMz9TpvpA8NXSz4AzP1Om+kGAABv8A8NXSz4AzP1Om+kDw1dLPgDM/U6b6QYAAG/8Aw1dLPgDM/U6b6QPDV0s+AMz9TpvpBgAAb/8ADV0s+AMz9TpvpA8NXSz4AzP1Om+kGAABv/w1dLPgDM/U6b6QPDV0s+AMz9TpvpBgAAb/APDV0s+AMz9TpvpA8NXSz4AzP1Om+kGAABv/AMNXSz4AzP1Om+kDw1dLPgDM/U6b6QYAAG//AA1dLPgDM/U6b6QPDV0s+AMz9TpvpBgAAb/8NXSz4AzP1Om+kDw1dLPgDM/U6b6QYAAG/wDw1dLPgDM/U6b6QPDV0s+AMz9TpvpBgAAb/wDDV0s+AMz9TpvpA8NXSz4AzP1Om+kGAABv/wANXSz4AzP1Om+kDw1dLPgDM/U6b6QYAAG//DV0s+AMz9TpvpA8NXSz4AzP1Om+kGAABv8A8NXSz4AzP1Om+kDw1dLPgDM/U6b6QYAAG/8Aw1dLPgDM/U6b6QdVkXTcw6Gm3x7Db9XT7dVfJFTNRflY6RV/IhhUAWtrVr3n2qe9HdayO3WVHbttdDuyF23UsiqqukXqX3y7IvNEQqkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=";

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ══ BRANDED HEADER ══ */
  .fdl-header {
    background: linear-gradient(135deg, #0a1628 0%, #0d2147 60%, #1a0a0a 100%);
    color: #fff;
    position: relative;
    overflow: hidden;
    border-bottom: 4px solid #dc2626;
  }
  .fdl-header::before {
    content: "";
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(220,38,38,0.22) 0%, transparent 70%);
    pointer-events: none;
  }
  .fdl-header::after {
    content: "";
    position: absolute;
    bottom: -30px; left: 20%;
    width: 340px; height: 140px;
    background: radial-gradient(ellipse, rgba(220,38,38,0.10) 0%, transparent 70%);
    pointer-events: none;
  }
  .fdl-header-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 20px 20px;
    gap: 4px;
  }
  /* Logo sits directly — no pill needed, white bg is part of the image */
  .fdl-logo-wrap {
    margin-bottom: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .fdl-logo-wrap img {
    height: 64px;
    width: auto;
    display: block;
  }
  .fdl-event-date {
    background: #dc2626;
    border-radius: 8px;
    padding: 5px 16px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .fdl-title-pre    { font-size: 42px; font-weight: 900; color: #dc2626; letter-spacing: 3px; line-height: 1; text-transform: uppercase; }
  .fdl-title-season { font-size: 42px; font-weight: 900; color: #ffffff; letter-spacing: 3px; line-height: 1; text-transform: uppercase; }
  .fdl-title-cup    { font-size: 34px; font-weight: 900; color: #f59e0b; letter-spacing: 4px; line-height: 1; text-transform: uppercase; margin-bottom: 6px; }
  .fdl-location { display: flex; align-items: center; gap: 6px; font-size: 14px; color: rgba(255,255,255,0.70); margin-top: 2px; }
  .fdl-url { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.5px; margin-top: 4px; }
  .fdl-stripe {
    position: absolute; bottom: 0; left: 0; right: 0; height: 5px;
    background: repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 20px, #0a1628 20px, #0a1628 22px);
  }

  /* ══ MOBILE TAB BAR ══ */
  .mob-tabs {
    display: none;
    position: sticky; top: 0; z-index: 100;
    background: #0a1628;
    border-bottom: 3px solid #dc2626;
  }
  .mob-tabs button {
    flex: 1; padding: 13px 4px; font-size: 13px; font-weight: 700;
    border: none; background: transparent; color: rgba(255,255,255,0.50);
    cursor: pointer; border-bottom: 3px solid transparent; margin-bottom: -3px;
  }
  .mob-tabs button.active { color: #f59e0b; border-bottom-color: #f59e0b; }

  /* ══ SECTION TITLE BAR ══ */
  .section-title-bar {
    display: none; align-items: center; gap: 10px;
    background: #f9fafb; border-bottom: 1px solid #e5e7eb; padding: 10px 14px 8px;
  }
  .section-title-bar h2 { font-size: 20px; font-weight: 900; color: #0a1628; }
  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: pulse 1.5s infinite; flex-shrink: 0; }
  .live-label { font-size: 11px; font-weight: 700; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }

  /* ══ MOBILE FILTER BAR ══ */
  .mob-filter-bar {
    display: none; flex-direction: column; gap: 8px;
    padding: 10px 12px; background: #fff; border-bottom: 1px solid #e5e7eb;
  }
  .mob-filter-row { display: flex; gap: 8px; }
  .mob-filter-bar select {
    flex: 1; padding: 9px 12px; border-radius: 10px; border: 1.5px solid #d1d5db;
    background: #fff; font-size: 14px; font-weight: 500; color: #374151; appearance: auto;
  }
  .mob-filter-bar select.team-select { border-color: #1d4ed8; color: #1d4ed8; font-weight: 700; }
  .mob-team-banner {
    display: flex; align-items: center; justify-content: space-between;
    background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px;
    padding: 8px 12px; font-size: 13px; font-weight: 700; color: #1d4ed8;
  }
  .mob-team-banner button { background: none; border: none; font-size: 16px; cursor: pointer; color: #1d4ed8; padding: 0 0 0 8px; }

  /* ══ MOBILE FIXTURE CARDS ══ */
  .mob-fixture-card {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 14px;
    padding: 12px 14px; margin-bottom: 10px;
  }
  .mob-fixture-card .top-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .mob-fixture-card .pitch-label { font-size: 12px; font-weight: 700; color: #6b7280; }
  .mob-fixture-card .stage-label { font-size: 11px; color: #9ca3af; margin-left: auto; }
  .mob-fixture-card .teams { font-size: 16px; font-weight: 700; color: #111827; line-height: 1.4; }
  .mob-fixture-card .teams .vs { color: #9ca3af; font-weight: 400; font-size: 14px; margin: 0 6px; }
  .mob-fixture-card .score-display { margin-top: 8px; font-size: 28px; font-weight: 900; color: #0a1628; letter-spacing: 2px; }
  .mob-fixture-card .score-pending { margin-top: 6px; font-size: 12px; color: #d1d5db; font-style: italic; }
  .mob-fixture-card.highlight-team { border-color: #1d4ed8; border-width: 2px; background: #eff6ff; }
  .time-header {
    background: #0a1628; color: #f59e0b; border-radius: 8px;
    padding: 7px 14px; font-weight: 800; font-size: 14px; margin: 16px 0 8px; letter-spacing: 0.5px;
  }
  .time-header:first-child { margin-top: 0; }

  /* ══ PILL BADGES ══ */
  .pill { display: inline-block; padding: 2px 9px; border-radius: 99px; font-size: 11px; font-weight: 700; white-space: nowrap; }
  .pill-u78   { background: #fef3c7; color: #92400e; }
  .pill-u910  { background: #e0f2fe; color: #0c4a6e; }
  .pill-u1112 { background: #d1fae5; color: #065f46; }

  /* ══ MOBILE STANDINGS ══ */
  .mob-standings { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; margin-bottom: 16px; overflow: hidden; }
  .mob-standings h3 { padding: 12px 14px; font-size: 15px; font-weight: 800; color: #0a1628; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
  .mob-standings table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .mob-standings th { background: #f3f4f6; padding: 8px 6px; text-align: center; color: #6b7280; font-weight: 700; font-size: 11px; }
  .mob-standings td { padding: 9px 6px; text-align: center; border-top: 1px solid #f3f4f6; color: #374151; }
  .mob-standings td.team-col { text-align: left; padding-left: 10px; font-weight: 600; }
  .mob-standings td.pts-col  { font-weight: 800; color: #0a1628; }
  .mob-standings tr.my-team td { background: #eff6ff !important; color: #1d4ed8; font-weight: 800; }
  .mob-standings tr:nth-child(even) td { background: #f9fafb; }

  /* ══ MOBILE FINALS ══ */
  .mob-finals-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; margin-bottom: 12px; }
  .mob-finals-card .final-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 5px; }
  .mob-finals-card .final-teams { font-size: 15px; font-weight: 700; color: #111827; }
  .mob-finals-card .final-tbc   { font-size: 13px; color: #9ca3af; }

  /* ══ DESKTOP ADMIN TABLE ══ */
  .admin-table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .admin-table-wrap table { min-width: 750px; width: 100%; border-collapse: collapse; font-size: 13px; }
  .admin-table-wrap th, .admin-table-wrap td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #f3f4f6; white-space: nowrap; }
  .admin-table-wrap td.fixture-col { white-space: normal; min-width: 180px; max-width: 240px; }
  .score-inputs { display: flex; align-items: center; gap: 6px; }
  .score-inputs input { width: 48px; padding: 6px; text-align: center; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-weight: 700; }

  /* ══ RESPONSIVE ══ */
  .desktop-only { display: block; }
  .mobile-only  { display: none !important; }

  @media (max-width: 768px) {
    .desktop-only      { display: none !important; }
    .mobile-only       { display: block !important; }
    .mob-tabs          { display: flex !important; }
    .mob-filter-bar    { display: flex !important; }
    .section-title-bar { display: flex !important; }
    .page  { overflow-x: hidden; padding: 0; background: #f3f4f6; }
    .wrap  { padding: 0; }
    .mob-content { padding: 12px; }
    .fdl-title-pre, .fdl-title-season { font-size: 32px; }
    .fdl-title-cup { font-size: 26px; }
    .fdl-logo-wrap img { height: 52px; }
  }
`;

const AGE_OPTIONS = ["All", "U7/8", "U9/10", "U11/12"];
const TAB_TITLES  = { fixtures: "Fixtures", tables: "League Tables", finals: "Finals & Results" };

export default function TournamentPanel({ mode = "public" }) {
  const isAdmin = mode === "admin";

  const [teamSearch, setTeamSearch]     = useState("");
  const [ageFilter, setAgeFilter]       = useState("All");
  const [showOnlyTeam, setShowOnlyTeam] = useState(false);
  const [email, setEmail]               = useState("");
  const [authMessage, setAuthMessage]   = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [scores, setScores]             = useState(createScoreMap(initialFixtures));
  const [loading, setLoading]           = useState(true);

  const [mobTab,  setMobTab]  = useState("fixtures");
  const [mobAge,  setMobAge]  = useState("All");
  const [mobTeam, setMobTeam] = useState("");

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    async function boot() {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setSessionEmail(session?.user?.email || "");
      const { data, error } = await supabase.from("match_scores").select("*");
      if (!error && data && mounted) {
        const base = createScoreMap(initialFixtures);
        data.forEach((row) => {
          base[row.fixture_id] = {
            home: row.home_score === null ? "" : String(row.home_score),
            away: row.away_score === null ? "" : String(row.away_score),
          };
        });
        setScores(base);
      }
      if (mounted) setLoading(false);
    }

    boot();

    const channel = supabase
      .channel("fdl-match-scores")
      .on("postgres_changes", { event: "*", schema: "public", table: "match_scores" }, async () => {
        const { data } = await supabase.from("match_scores").select("*");
        if (data && mounted) {
          const base = createScoreMap(initialFixtures);
          data.forEach((row) => {
            base[row.fixture_id] = {
              home: row.home_score === null ? "" : String(row.home_score),
              away: row.away_score === null ? "" : String(row.away_score),
            };
          });
          setScores(base);
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      if (supabase) supabase.removeChannel(channel);
    };
  }, []);

  const baseFixturesWithScores = useMemo(
    () => initialFixtures.map((f) => ({
      ...f,
      homeScore: scores[f.id]?.home ?? "",
      awayScore: scores[f.id]?.away ?? "",
      resolvedHome: f.home,
      resolvedAway: f.away,
    })),
    [scores]
  );

  const standings = useMemo(() => ({
    u78:    buildStandings(u78Teams,      baseFixturesWithScores, "u78"),
    u910:   buildStandings(u910Teams,     baseFixturesWithScores, "u910"),
    u1112A: buildStandings(u1112Groups.A, baseFixturesWithScores, "u1112A"),
    u1112B: buildStandings(u1112Groups.B, baseFixturesWithScores, "u1112B"),
  }), [baseFixturesWithScores]);

  const fixtures = useMemo(() => {
    return initialFixtures.map((f) => {
      let resolvedHome = f.home;
      let resolvedAway = f.away;
      if (f.dynamic) {
        resolvedHome = resolveTeam(f.dynamic.home, standings, baseFixturesWithScores);
        resolvedAway = resolveTeam(f.dynamic.away, standings, baseFixturesWithScores);
      }
      return { ...f, homeScore: scores[f.id]?.home ?? "", awayScore: scores[f.id]?.away ?? "", resolvedHome, resolvedAway };
    });
  }, [scores, standings, baseFixturesWithScores]);

  const groupedSchedule = useMemo(() => {
    return timeOrder.map((time) => ({
      time,
      fixtures: pitchOrder.map((pitch) => fixtures.find((f) => f.time === time && f.pitch === pitch)).filter(Boolean),
    }));
  }, [fixtures]);

  const filteredFixtures = useMemo(() => {
    return fixtures.filter((f) => {
      if (ageFilter !== "All" && f.age !== ageFilter) return false;
      if (!showOnlyTeam || !teamSearch.trim()) return true;
      const needle = teamSearch.toLowerCase();
      return (
        (f.resolvedHome || "").toLowerCase().includes(needle) ||
        (f.resolvedAway || "").toLowerCase().includes(needle) ||
        (f.home || "").toLowerCase().includes(needle) ||
        (f.away || "").toLowerCase().includes(needle)
      );
    });
  }, [fixtures, ageFilter, showOnlyTeam, teamSearch]);

  const mobileFixtures = useMemo(() => {
    const needle = mobTeam.toLowerCase();
    const filtered = fixtures.filter((f) => {
      if (mobAge !== "All" && f.age !== mobAge) return false;
      if (!mobTeam) return true;
      return (
        (f.resolvedHome || "").toLowerCase().includes(needle) ||
        (f.resolvedAway || "").toLowerCase().includes(needle)
      );
    });
    return timeOrder.map((time) => ({
      time,
      fixtures: filtered
        .filter((f) => f.time === time)
        .sort((a, b) => pitchOrder.indexOf(a.pitch) - pitchOrder.indexOf(b.pitch)),
    })).filter(({ fixtures }) => fixtures.length > 0);
  }, [fixtures, mobAge, mobTeam]);

  function pillClass(age) {
    if (age === "U7/8")  return "pill pill-u78";
    if (age === "U9/10") return "pill pill-u910";
    return "pill pill-u1112";
  }

  function isMyTeam(name) {
    if (!mobTeam) return false;
    return (name || "").toLowerCase().includes(mobTeam.toLowerCase());
  }

  async function signIn() {
    if (!supabase || !email) return;
    const redirectTo = typeof window !== "undefined" ? window.location.origin + "/admin" : undefined;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setAuthMessage(error ? error.message : "Magic link sent. Open the email on this device.");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSessionEmail("");
  }

  async function setScore(id, side, value) {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const newScores = { ...scores, [id]: { ...scores[id], [side]: value } };
    setScores(newScores);
    if (!supabase || !sessionEmail || !isAdmin) return;
    const row = newScores[id];
    await supabase.from("match_scores").upsert({
      fixture_id: id,
      home_score: row.home === "" ? null : Number(row.home),
      away_score: row.away === "" ? null : Number(row.away),
      updated_by_email: sessionEmail,
      updated_at: new Date().toISOString(),
    }, { onConflict: "fixture_id" });
  }

  const standingsCard = (title, rows) => (
    <div className="card">
      <h2>{title}</h2>
      <div className="pad" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.team}>
                <td>{idx + 1}</td><td><strong>{row.team}</strong></td>
                <td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td>
                <td>{row.gf}</td><td>{row.ga}</td><td>{row.gd}</td><td><strong>{row.pts}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const mobStandingsCard = (title, rows) => (
    <div className="mob-standings">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th style={{ textAlign: "left", paddingLeft: 10 }}>Team</th>
            <th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.team} className={isMyTeam(row.team) ? "my-team" : ""}>
              <td>{idx + 1}</td>
              <td className="team-col">{row.team}</td>
              <td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td>
              <td>{row.gd}</td>
              <td className="pts-col">{row.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const finalFixture = (id) => fixtures.find((f) => f.id === id);

  return (
    <div className="page" style={{ overflowX: "hidden" }}>
      <style>{styles}</style>

      {/* ══ BRANDED HEADER ══ */}
      <div className="fdl-header">
        <div className="fdl-header-inner">
          {/* Logo — white background is baked into the image */}
          <div className="fdl-logo-wrap">
            <img src={FDL_LOGO_SRC} alt="Football Development League" />
          </div>
          <div className="fdl-event-date">Sunday Mar 22 · U7–U12</div>
          <div className="fdl-title-pre">PRE</div>
          <div className="fdl-title-season">SEASON</div>
          <div className="fdl-title-cup">CUP 2026</div>
          <div className="fdl-location"><span>📍</span><span>Adelaide Oval – Killarney Vale</span></div>
          <div className="fdl-url">www.footballdevelopmentleague.com.au</div>
        </div>
        <div className="fdl-stripe" />
      </div>

      {/* ══ MOBILE: Tab bar ══ */}
      <div className="mob-tabs mobile-only">
        {[
          { key: "fixtures", label: "📋 Fixtures" },
          { key: "tables",   label: "🏆 Tables"   },
          { key: "finals",   label: "⚡ Finals"    },
        ].map(({ key, label }) => (
          <button key={key} className={mobTab === key ? "active" : ""} onClick={() => setMobTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* ══ MOBILE: Section title ══ */}
      <div className="section-title-bar mobile-only">
        <h2>{TAB_TITLES[mobTab]}</h2>
        {!loading && <><div className="live-dot" /><span className="live-label">Live</span></>}
      </div>

      {/* ══ MOBILE: Filter bar ══ */}
      {(mobTab === "fixtures" || mobTab === "tables") && (
        <div className="mob-filter-bar mobile-only">
          <div className="mob-filter-row">
            <select value={mobAge} onChange={(e) => setMobAge(e.target.value)}>
              {AGE_OPTIONS.map((a) => <option key={a}>{a}</option>)}
            </select>
            <select
              value={mobTeam}
              onChange={(e) => setMobTeam(e.target.value)}
              className={mobTeam ? "team-select" : ""}
            >
              <option value="">My Team…</option>
              {ALL_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {mobTeam && (
            <div className="mob-team-banner">
              <span>📌 Showing: {mobTeam}</span>
              <button onClick={() => setMobTeam("")}>✕</button>
            </div>
          )}
        </div>
      )}

      {/* ══ MOBILE: Content ══ */}
      <div className="mobile-only mob-content">

        {/* FIXTURES */}
        {mobTab === "fixtures" && (
          <div>
            {mobileFixtures.length === 0 && (
              <p style={{ color: "#9ca3af", textAlign: "center", marginTop: 40, fontSize: 14 }}>No fixtures found.</p>
            )}
            {mobileFixtures.map(({ time, fixtures: atTime }) => (
              <div key={time}>
                <div className="time-header">⏱ {time}</div>
                {atTime.map((f) => {
                  const hasScore = scoreNumber(f.homeScore) !== null || scoreNumber(f.awayScore) !== null;
                  const myGame   = isMyTeam(f.resolvedHome) || isMyTeam(f.resolvedAway);
                  return (
                    <div key={f.id} className={`mob-fixture-card${myGame ? " highlight-team" : ""}`}>
                      <div className="top-row">
                        <span className="pitch-label">{f.pitch}</span>
                        <span className={pillClass(f.age)}>{f.age}</span>
                        <span className="stage-label">{f.label || f.stage}</span>
                      </div>
                      <div className="teams">
                        <span style={isMyTeam(f.resolvedHome) ? { color: "#1d4ed8" } : {}}>{f.resolvedHome}</span>
                        <span className="vs">vs</span>
                        <span style={isMyTeam(f.resolvedAway) ? { color: "#1d4ed8" } : {}}>{f.resolvedAway}</span>
                      </div>
                      {hasScore
                        ? <div className="score-display">{f.homeScore || 0} – {f.awayScore || 0}</div>
                        : <div className="score-pending">Score pending</div>
                      }
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* TABLES */}
        {mobTab === "tables" && (
          <div>
            {(mobAge === "All" || mobAge === "U7/8")   && mobStandingsCard("U7/8 League Table",  standings.u78)}
            {(mobAge === "All" || mobAge === "U9/10")  && mobStandingsCard("U9/10 League Table", standings.u910)}
            {(mobAge === "All" || mobAge === "U11/12") && (
              <>
                {mobStandingsCard("U11/12 Group A", standings.u1112A)}
                {mobStandingsCard("U11/12 Group B", standings.u1112B)}
              </>
            )}
          </div>
        )}

        {/* FINALS */}
        {mobTab === "finals" && (
          <div>
            <div style={{ marginBottom: 12, fontSize: 13, color: "#6b7280" }}>
              Finals auto-fill once all required league and group games are complete.
              {loading ? " Loading…" : " Live via Supabase."}
            </div>
            {[
              { title: "U7/8 Grand Final",   id: "u78-final"       },
              { title: "U9/10 Semi Final 1", id: "u910-top-semi-1" },
              { title: "U9/10 Semi Final 2", id: "u910-top-semi-2" },
              { title: "U9/10 Grand Final",  id: "u910-final"      },
              { title: "U11/12 Grand Final", id: "u1112-final"     },
              { title: "U11/12 3rd/4th",     id: "u1112-34"        },
              { title: "U11/12 5th/6th",     id: "u1112-56"        },
              { title: "U11/12 7th/8th",     id: "u1112-78"        },
            ].map(({ title, id }) => {
              const f        = finalFixture(id);
              const isTBC    = !f || f.resolvedHome === "TBC" || f.resolvedAway === "TBC";
              const hasScore = f && (scoreNumber(f.homeScore) !== null || scoreNumber(f.awayScore) !== null);
              return (
                <div key={id} className="mob-finals-card">
                  <div className="final-title">{title}</div>
                  {isTBC ? (
                    <div className="final-tbc">Teams TBC — awaiting results</div>
                  ) : (
                    <>
                      <div className="final-teams">{f.resolvedHome} vs {f.resolvedAway}</div>
                      {hasScore && (
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#0a1628", marginTop: 4 }}>
                          {f.homeScore || 0} – {f.awayScore || 0}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══ DESKTOP ══ */}
      <div className="desktop-only">
        <div className="wrap">
          {!supabase && (
            <div className="notice">Supabase environment variables are missing.</div>
          )}
          {isAdmin && (
            <div className="card">
              <h2>Admin Login</h2>
              <div className="pad stack">
                <div className="small">Use your email to receive a magic link.</div>
                <div className="filters">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" />
                  <button onClick={signIn}>Send Magic Link</button>
                  <button className="secondary" onClick={signOut}>Sign Out</button>
                </div>
                <div className="small">Signed in as: {sessionEmail || "Not signed in"}</div>
                {authMessage && <div className="small">{authMessage}</div>}
              </div>
            </div>
          )}
          <div className="card">
            <h2>Filters</h2>
            <div className="pad">
              <div className="filters">
                <input value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)} placeholder="Find a team" />
                <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                  <option>All</option><option>U7/8</option><option>U9/10</option><option>U11/12</option>
                </select>
                <button className="secondary" onClick={() => setShowOnlyTeam((v) => !v)}>
                  {showOnlyTeam ? "Showing team matches" : "Show team fixtures only"}
                </button>
              </div>
              <div className="small" style={{ marginTop: 8 }}>
                Ladder: Points → Goal Difference → Goals For → Head-to-Head. Finals auto-fill when league/group games complete.
              </div>
            </div>
          </div>
          <div className="grid">
            <div>
              {isAdmin && (
                <div className="card">
                  <h2>Score Entry</h2>
                  <div className="pad">
                    <div className="admin-table-wrap">
                      <table>
                        <thead>
                          <tr><th>Time</th><th>Pitch</th><th>Age</th><th>Stage</th><th className="fixture-col">Fixture</th><th>Score</th></tr>
                        </thead>
                        <tbody>
                          {filteredFixtures
                            .slice()
                            .sort((a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time) || pitchOrder.indexOf(a.pitch) - pitchOrder.indexOf(b.pitch))
                            .map((f) => (
                              <tr key={f.id}>
                                <td>{f.time}</td>
                                <td>{f.pitch}</td>
                                <td><span className={`badge ${ageColor(f.age)}`}>{f.age}</span></td>
                                <td>{f.label || f.stage}</td>
                                <td className="fixture-col">
                                  <strong>{f.resolvedHome} vs {f.resolvedAway}</strong>
                                  <div className="small">{f.round}</div>
                                </td>
                                <td>
                                  <div className="score-inputs">
                                    <input value={scores[f.id]?.home ?? ""} onChange={(e) => setScore(f.id, "home", e.target.value)} />
                                    <span style={{ color: "#9ca3af", fontWeight: 700 }}>–</span>
                                    <input value={scores[f.id]?.away ?? ""} onChange={(e) => setScore(f.id, "away", e.target.value)} />
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              <div className="card">
                <h2>Six-Pitch Timeline</h2>
                <div className="pad" style={{ overflowX: "auto" }}>
                  <div className="timeline-grid">
                    <div className="timeline-head">Time</div>
                    {pitchOrder.map((pitch) => <div key={pitch} className="timeline-head">{pitch}</div>)}
                    {groupedSchedule.map(({ time, fixtures: atTime }) => (
                      <>
                        <div key={`time-${time}`} className="timeline-head">{time}</div>
                        {pitchOrder.map((pitch) => {
                          const fixture = atTime.find((f) => f.pitch === pitch);
                          return (
                            <div key={`${time}-${pitch}`}>
                              {fixture ? (
                                <div className={`fixture-box ${ageColor(fixture.age)}`}>
                                  <div className="small">{fixture.age} • {fixture.label || fixture.stage}</div>
                                  <div><strong>{fixture.resolvedHome}</strong> vs <strong>{fixture.resolvedAway}</strong></div>
                                  {(scoreNumber(fixture.homeScore) !== null || scoreNumber(fixture.awayScore) !== null) ? (
                                    <div style={{ marginTop: 6, fontWeight: "bold" }}>{fixture.homeScore || 0} - {fixture.awayScore || 0}</div>
                                  ) : null}
                                </div>
                              ) : "—"}
                            </div>
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {standingsCard("U7/8 League Table",  standings.u78)}
              {standingsCard("U9/10 League Table", standings.u910)}
              {standingsCard("U11/12 Group A",     standings.u1112A)}
              {standingsCard("U11/12 Group B",     standings.u1112B)}
              <div className="card">
                <h2>Finals Check</h2>
                <div className="pad stack">
                  <div><strong>U7/8 Final:</strong> {finalFixture("u78-final")?.resolvedHome} vs {finalFixture("u78-final")?.resolvedAway}</div>
                  <div><strong>U9/10 Grand Final:</strong> {finalFixture("u910-final")?.resolvedHome} vs {finalFixture("u910-final")?.resolvedAway}</div>
                  <div><strong>U11/12 Grand Final:</strong> {finalFixture("u1112-final")?.resolvedHome} vs {finalFixture("u1112-final")?.resolvedAway}</div>
                  {loading ? <div className="small">Loading…</div> : <div className="small">Live via Supabase.</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
