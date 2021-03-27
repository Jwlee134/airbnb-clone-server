import { addHours, addMonths, eachDayOfInterval } from "date-fns";
import { Request, Response } from "express";
import Room from "../../model/Room";

export const getSearchResults = async (req: Request, res: Response) => {
  try {
    const {
      latitude,
      longitude,
      checkIn,
      checkOut,
      adults,
      children,
      page = "1",
      limit = "10",
      roomType = ["entire", "public", "private"],
      minPrice = "0",
      maxPrice = "999999999999",
      bedCount = "0",
      bedroomCount = "0",
      bathroomCount = "0",
      buildingType = [],
      amenities = [],
      spaces = [],
      coordsBounds = "0.02",
    } = req.query;

    let formatDates: string[] = [];

    if (checkIn && checkOut) {
      // 체크인, 체크아웃 날짜를 포함한 사이의 날짜들의 배열
      const datesArray = eachDayOfInterval({
        start: new Date(checkIn as string),
        end: new Date(checkOut as string),
      });
      // 데이터베이스에 저장된 날짜의 형식으로 포맷
      formatDates = datesArray.map((date) => {
        return addHours(date, 12).toISOString();
      });
    }

    const data = await Room.find({
      // 숙소의 위도 경도가 현재 위도 경도 기준 ±0.02 이내인 것들로 필터링
      latitude: {
        $gte: Number(latitude) - Number(coordsBounds),
        $lte: Number(latitude) + Number(coordsBounds),
      },
      longitude: {
        $gte: Number(longitude) - Number(coordsBounds),
        $lte: Number(longitude) + Number(coordsBounds),
      },
      // 호스트가 설정해둔 예약 불가 날짜에 체크인, 체크아웃 날짜가 포함되어 있으면 필터링
      blockedDayList: {
        $nin: formatDates,
      },
      // 최대 게스트 인원이 숙소 최대 게스트 인원보다 높으면 필터링
      maximumGuestCount: {
        $gte: Number(adults) + Number(children),
      },
      // 기본적으로 예약 차단(0)이면 필터링
      availability: {
        $gte: 1,
      },
      // 검색 필터(집 전체, 개인실, 다인실)
      roomType: {
        $in: roomType,
      },
      // 가격 필터
      price: {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      },
      // 셋 중 하나라도 만족하지 않으면 필터링
      $and: [
        {
          bedCount: {
            $gte: Number(bedCount),
          },
        },
        {
          bedroomCount: {
            $gte: Number(bedroomCount),
          },
        },
        {
          bathroomCount: {
            $gte: Number(bathroomCount),
          },
        },
      ],
    });
    // 건물 유형으로 필터링
    const filteredByBuildingType = data.filter(
      ({ largeBuildingType: { label } }) => {
        let options: string[] = [];
        if (typeof buildingType === "string") {
          options = [buildingType];
        } else {
          options = buildingType as string[];
        }
        if (options.length === 0) return true;
        return options.includes(label as string);
      }
    );
    // 편의 시설로 필터링
    const filteredByAmenities = filteredByBuildingType.filter((room) => {
      let options: string[] = [];
      if (typeof amenities === "string") {
        options = [amenities];
      } else {
        options = amenities as string[];
      }
      if (amenities.length === 0) return true;
      return options.every((option) => room.amenities.includes(option));
    });
    // 시설로 필터링
    const filteredBySpaces = filteredByAmenities.filter((room) => {
      let options: string[] = [];
      if (typeof spaces === "string") {
        options = [spaces];
      } else {
        options = spaces as string[];
      }
      if (spaces.length === 0) return true;
      return options.every((option) => room.spaces.includes(option));
    });
    // 호스트가 설정해둔 최대 예약 가능 월보다 체크인, 체크아웃 날짜가 넘어가면 필터링
    if (checkIn && checkOut) {
      const filteredByAvailability = filteredBySpaces.filter((room) => {
        // 항상 가능이면 필터링하지 않음
        if (room.availability === 1) return true;
        const availability = addMonths(new Date(), room.availability);
        const checkInDate = addHours(new Date(checkIn as string), -3);
        const checkOutDate = addHours(new Date(checkOut as string), -3);
        return availability >= checkInDate && availability >= checkOutDate;
      });
      const slicedFiltered = filteredByAvailability.slice(
        (Number(page) - 1) * Number(limit),
        Number(page) * Number(limit)
      );
      return res.status(200).json({
        data: slicedFiltered,
        originalLength: filteredByAvailability.length,
      });
    }

    const slicedData = filteredBySpaces.slice(
      (Number(page) - 1) * Number(limit),
      Number(page) * Number(limit)
    );

    return res.status(200).json({
      data: slicedData,
      originalLength: filteredBySpaces.length,
    });
  } catch (error) {
    return res.status(500).send("숙소를 불러올 수 없습니다.");
  }
};
