package com.starline.service;

import com.starline.dto.response.TonightSkyResponse;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TonightSkyService {

    public TonightSkyResponse getTonightSky() {
        int month = LocalDate.now().getMonthValue();
        if (month >= 3 && month <= 5) {
            return new TonightSkyResponse(
                    "東京",
                    "中",
                    "月明かりの影響を見ながら観察しましょう",
                    List.of("春の大三角", "しし座", "北斗七星"),
                    "夜の早い時間は東から南の空、遅い時間は北の空をゆっくり探してみましょう。",
                    "Starline 星座データ"
            );
        }
        if (month >= 6 && month <= 8) {
            return new TonightSkyResponse(
                    "東京",
                    "中",
                    "月が明るい日は一等星を中心に見るのがおすすめです",
                    List.of("夏の大三角", "こと座のベガ", "さそり座のアンタレス"),
                    "南から東の空を中心に、明るい星を目印に探してみましょう。",
                    "Starline 星座データ"
            );
        }
        if (month >= 9 && month <= 11) {
            return new TonightSkyResponse(
                    "東京",
                    "中",
                    "月の近くは星が見えにくくなります",
                    List.of("秋の四辺形", "ペガスス座", "アンドロメダ座"),
                    "空が暗い場所なら、東の空から天頂にかけて広く見渡してみましょう。",
                    "Starline 星座データ"
            );
        }
        return new TonightSkyResponse(
                "東京",
                "高",
                "澄んだ夜は冬の明るい星がよく見えます",
                List.of("オリオン座", "シリウス", "冬の大三角"),
                "南の空にあるオリオン座を見つけると、冬の星をたどりやすくなります。",
                "Starline 星座データ"
        );
    }
}
